const glob = require("glob");
const fs = require("fs");
const { build } = require("esbuild");
const ts = require("typescript");
const chalk = require("chalk");
const JSObfuscator = require("javascript-obfuscator"); // Add JSObfuscator

const defSettings = {
  removeTS: false,
  path: "BP/scripts",
  compilerOptions: {},
  outputFile: "BP/scripts/main.js",
  obfuscate: false,
  minify: false,
};
const settings = Object.assign(defSettings, process.argv[2] ? JSON.parse(process.argv[2]) : {});
const typeMap = {
  removeTS: "boolean",
  path: "string",
  compilerOptions: "object",
  outputFile: "string",
};
const throwTypeError = (k) => {
  throw new TypeError(`${k}: ${JSON.stringify(settings[k])} is not an ${typeMap[k]}`);
};
for (let k in typeMap) {
  if (typeMap[k] === "array") {
    if (!Array.isArray(settings[k])) throwTypeError(k);
  } else if (typeMap[k] === "object") {
    if (Array.isArray(settings[k])) throwTypeError(k);
  } else if (typeof settings[k] !== typeMap[k]) throwTypeError(k);
}

// Add validation function
const validateImports = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const importLines = content.match(/^import.*from.*$/gm) || [];
    const currentDir = filePath.substring(0, filePath.lastIndexOf("/"));

    return importLines.every((line) => {
      const match = line.match(/from\s+['"]([^'"]+)['"]/);
      if (!match || match[1].startsWith("@minecraft")) return true;

      const importPath = match[1];
      const resolvedPath = importPath.startsWith(".")
        ? `${currentDir}/${importPath}`.replace(/\/\.\//g, "/")
        : `${settings.path}/${importPath}`;
      const fullPath = resolvedPath.endsWith(".ts") ? resolvedPath : `${resolvedPath}.ts`;

      if (!fs.existsSync(fullPath)) {
        console.error(`Error: Missing import in ${filePath}: ${importPath}`);
        return false;
      }
      return true;
    });
  } catch (err) {
    console.error(`Error validating imports in ${filePath}:`, err);
    return false;
  }
};

// Add TypeScript compilation check
const checkTypeScriptErrors = (files) => {
  // Parse compiler options properly
  const compilerOptions = {
    target: "ES2020",
    module: "ESNext",
    moduleResolution: "node",
    allowJs: true,
    esModuleInterop: true,
    skipLibCheck: true,
    strict: true,
    noImplicitAny: true,
    noImplicitReturns: true,
    ...settings.compilerOptions,
  };

  const parsedConfig = ts.parseJsonConfigFileContent(
    { compilerOptions, files },
    ts.sys,
    process.cwd()
  );

  const program = ts.createProgram(files, parsedConfig.options);

  const diagnostics = ts.getPreEmitDiagnostics(program);

  if (diagnostics.length > 0) {
    diagnostics.forEach((diagnostic) => {
      if (diagnostic.file) {
        const { line, character } = ts.getLineAndCharacterOfPosition(
          diagnostic.file,
          diagnostic.start
        );
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        const location = `${diagnostic.file.fileName}:${line + 1}:${character + 1}`;

        console.error(
          `[ERROR] [ts_compile_minify] ${location} - error TS${diagnostic.code}: ${message}`
        );
      } else {
        console.error(
          `[ERROR] [ts_compile_minify] ${ts.flattenDiagnosticMessageText(
            diagnostic.messageText,
            "\n"
          )}`
        );
      }
    });
    // Throw error to stop the build
    throw new Error("TypeScript compilation failed");
  }
  return true;
};

// Add utility functions for name randomization
const generateRandomName = (length = 8) => {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  return (
    "_" +
    Array(length)
      .fill()
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join("")
  );
};

const getRandomizedPath = (filePath, baseDir) => {
  const relativePath = filePath.replace(baseDir + "/", "");
  const dirs = relativePath.split("/");
  const fileName = dirs.pop();

  // Don't randomize main.js
  if (fileName === "main.js" || fileName === "main.ts") {
    return `${baseDir}/${dirs.join("/")}/${fileName.replace(".ts", ".js")}`;
  }

  // Randomize other file names but keep directory structure
  const randomName = generateRandomName();
  return `${baseDir}/${dirs.join("/")}/${randomName}.js`;
};

// Modified build process for individual files
const processFile = async (filePath, settings) => {
  const outputPath = settings.obfuscate
    ? getRandomizedPath(filePath, settings.path)
    : filePath.replace(".ts", ".js");

  try {
    // Build individual file
    await build({
      entryPoints: [filePath],
      outfile: outputPath,
      bundle: true,
      minify: settings.minify,
      platform: "node",
      format: "esm",
      target: "es2020",
      external: ["@minecraft/*", "@minecraft/server", "@minecraft/server-ui"],
      resolveExtensions: [".ts", ".js"],
      keepNames: !settings.obfuscate,
    });

    // Obfuscate if needed
    if (settings.obfuscate) {
      const code = fs.readFileSync(outputPath, "utf8");
      const obfuscatedCode = JSObfuscator.obfuscate(code, {
        compact: settings.minify,
        controlFlowFlattening: true,
        renameGlobals: true,
        stringArray: true,
      }).getObfuscatedCode();
      fs.writeFileSync(outputPath, obfuscatedCode);
    }

    return outputPath;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
};

// Add cleanup function
const cleanupExtraFiles = (processedFiles, settings) => {
  // Get all .js files in the scripts directory and subdirectories
  const jsFiles = glob.sync(`${settings.path}/**/*.js`);

  jsFiles.forEach((file) => {
    // Keep main.js, remove everything else
    if (file !== settings.outputFile) {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    }
  });

  // Remove the file-mapping.json if it exists
  const mappingFile = `${settings.path}/file-mapping.json`;
  if (fs.existsSync(mappingFile)) {
    fs.unlinkSync(mappingFile);
  }

  // Remove empty folders recursively
  const removeEmptyFolders = (folder) => {
    if (!fs.existsSync(folder)) return;

    let files = fs.readdirSync(folder);

    for (const file of files) {
      const fullPath = `${folder}/${file}`;
      if (fs.statSync(fullPath).isDirectory()) {
        removeEmptyFolders(fullPath);
      }
    }

    // Check again after potential subfolder removal
    files = fs.readdirSync(folder);
    if (files.length === 0 && folder !== settings.path) {
      fs.rmdirSync(folder);
    }
  };

  // Start folder cleanup from the scripts path
  removeEmptyFolders(settings.path);
};

// Modified main process
glob(`${settings.path}/**/*.ts`, null, async (err, files) => {
  try {
    if (err) {
      throw new Error("Error finding TypeScript files: " + err);
    }

    const validFiles = files.filter((file) => validateImports(file));
    if (validFiles.length === 0) {
      throw new Error("No valid TypeScript files found after import validation");
    }

    // This will now throw an error if there are TypeScript errors
    checkTypeScriptErrors(validFiles);

    // Rest of the code only runs if no errors were found
    const processedFiles = await Promise.all(validFiles.map((file) => processFile(file, settings)));

    // Clean up original TypeScript files if removeTS is true
    if (settings.removeTS) {
      validFiles.forEach((file) => {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      });
      console.log("Cleaned up TypeScript files");
    }

    const successfulFiles = processedFiles.filter(Boolean);
    console.log(`Successfully processed ${successfulFiles.length} files`);

    // Clean up all files except main.js
    cleanupExtraFiles(processedFiles, settings);

    if (settings.removeTS) {
      validFiles.forEach((file) => {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      });
      console.log("Cleaned up TypeScript files");
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1); // Exit with error code
  }
});
