#!/usr/bin/env python3
"""
Script to fix Minecraft Bedrock API changes across TypeScript files.
Performs the following replacements:
1. world.beforeEvents.worldInitialize -> system.beforeEvents.startup
2. onPlayerDestroy -> onPlayerBreak
3. BlockComponentPlayerDestroyEvent -> BlockComponentPlayerBreakEvent
4. destroyedBlockPermutation -> brokenBlockPermutation
5. applyKnockback(x, z, horizontalForce, verticalForce) -> applyKnockback({x, z}, verticalForce)
6. runCommandAsync -> runCommand
7. Game mode strings: "creative" -> "Creative", "survival" -> "Survival", etc.
8. .isValid() -> isValid (method to property)

Also intelligently manages imports:
- Adds 'system' to @minecraft/server imports when world.beforeEvents.worldInitialize is replaced
"""

import os
import re
import glob
from pathlib import Path

def find_typescript_files(root_dir):
    """Find all TypeScript files in the project, excluding node_modules."""
    typescript_files = []
    for pattern in ['**/*.ts', '**/*.tsx']:
        files = glob.glob(os.path.join(root_dir, pattern), recursive=True)
        # Filter out files in node_modules directories
        filtered_files = [f for f in files if 'node_modules' not in f.replace('\\', '/')]
        typescript_files.extend(filtered_files)
    return typescript_files

def convert_apply_knockback(content):
    """Convert old applyKnockback syntax to new syntax."""
    # Pattern to match OLD syntax: entity.applyKnockback(x, z, horizontalForce, verticalForce)
    # This handles multi-line calls and ensures the first parameter is NOT an object literal
    # Uses DOTALL flag to match across newlines
    pattern = r'(\w+)\.applyKnockback\(\s*(?!\{)([^,{]+?),\s*([^,{]+?),\s*([^,]+?),\s*([^)]+?)\s*\)'
    
    def knockback_replacer(match):
        entity = match.group(1)
        x = match.group(2).strip()
        z = match.group(3).strip()
        horizontal_force = match.group(4).strip()
        vertical_force = match.group(5).strip()
        
        # Convert to new syntax
        return f'{entity}.applyKnockback({{ x: {x}, z: {z} }}, {vertical_force})'
    
    return re.sub(pattern, knockback_replacer, content, flags=re.DOTALL)

def add_system_to_imports(content):
    """Add 'system' to @minecraft/server imports if not already present."""
    # Pattern to find @minecraft/server import statements
    import_pattern = r'import\s*\{([^}]+)\}\s*from\s*["\']@minecraft/server["\'];?'
    
    def import_replacer(match):
        imports_content = match.group(1)
        
        # Check if 'system' is already imported
        if re.search(r'\bsystem\b', imports_content):
            return match.group(0)  # Return unchanged if system is already there
        
        # Clean up the imports content and split into individual imports
        imports_list = [imp.strip() for imp in imports_content.split(',') if imp.strip()]
        
        # Add 'system' to the imports
        imports_list.append('system')
        
        # Sort imports alphabetically for consistency
        imports_list.sort()
        
        # Reconstruct the import statement with proper formatting
        if len(imports_list) <= 3:
            # Single line format for short imports
            formatted_imports = ', '.join(imports_list)
            return f'import {{ {formatted_imports} }} from "@minecraft/server";'
        else:
            # Multi-line format for longer imports
            formatted_imports = ',\n  '.join(imports_list)
            return f'import {{\n  {formatted_imports},\n}} from "@minecraft/server";'
    
    return re.sub(import_pattern, import_replacer, content)

def apply_replacements(file_path):
    """Apply the API replacements to a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Check if we'll be replacing world.beforeEvents.worldInitialize
        needs_system_import = bool(re.search(r'world\.beforeEvents\.worldInitialize', content))
        
        # Also check if file uses 'system' but doesn't import it (for files already processed)
        uses_system = bool(re.search(r'\bsystem\b', content))
        has_minecraft_import = bool(re.search(r'from\s*["\']@minecraft/server["\']', content))
        has_system_import = bool(re.search(r'import\s*\{[^}]*\bsystem\b[^}]*\}\s*from\s*["\']@minecraft/server["\']', content))
        
        # Define replacements (order matters for some cases)
        replacements = [
            # 1. world.beforeEvents.worldInitialize -> system.beforeEvents.startup
            (r'world\.beforeEvents\.worldInitialize', 'system.beforeEvents.startup'),
            
            # 2. onPlayerDestroy -> onPlayerBreak (but not inside other words)
            (r'\bonPlayerDestroy\b', 'onPlayerBreak'),
            
            # 3. BlockComponentPlayerDestroyEvent -> BlockComponentPlayerBreakEvent
            (r'\bBlockComponentPlayerDestroyEvent\b', 'BlockComponentPlayerBreakEvent'),
            
            # 4. destroyedBlockPermutation -> brokenBlockPermutation
            (r'\bdestroyedBlockPermutation\b', 'brokenBlockPermutation'),
            
            # 5. runCommandAsync -> runCommand
            (r'\brunCommandAsync\b', 'runCommand'),
            
            # 6. Game mode strings to proper case
            (r'"creative"', '"Creative"'),
            (r'"survival"', '"Survival"'),
            (r'"adventure"', '"Adventure"'),
            (r'"spectator"', '"Spectator"'),
            
            # 7. .isValid() -> isValid (method call to property)
            (r'\.isValid\(\)', '.isValid'),
        ]
        
        # Apply each replacement
        changes_made = []
        for pattern, replacement in replacements:
            if re.search(pattern, content):
                old_content = content
                content = re.sub(pattern, replacement, content)
                if old_content != content:
                    changes_made.append(f"{pattern} -> {replacement}")
        
        # Apply applyKnockback conversion
        old_content = content
        content = convert_apply_knockback(content)
        if old_content != content:
            changes_made.append("Updated applyKnockback to new API syntax")
        
        # Add system import if needed (either from replacement or existing usage)
        should_add_system = (
            (needs_system_import and any(r'world\.beforeEvents\.worldInitialize' in change for change in changes_made)) or
            (uses_system and has_minecraft_import and not has_system_import)
        )
        
        if should_add_system:
            old_content = content
            content = add_system_to_imports(content)
            if old_content != content:
                changes_made.append("Added 'system' to @minecraft/server imports")
        
        # Write back if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return changes_made
        
        return []
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return []

def main():
    """Main function to process all TypeScript files."""
    # Get the script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Find all TypeScript files in the project
    typescript_files = find_typescript_files(script_dir)
    
    if not typescript_files:
        print("No TypeScript files found!")
        return
    
    print(f"Found {len(typescript_files)} TypeScript files to process...")
    print()
    
    total_files_changed = 0
    total_changes = 0
    
    for file_path in typescript_files:
        relative_path = os.path.relpath(file_path, script_dir)
        changes = apply_replacements(file_path)
        
        if changes:
            total_files_changed += 1
            total_changes += len(changes)
            print(f"✓ {relative_path}")
            for change in changes:
                print(f"  - {change}")
            print()
    
    print(f"Summary:")
    print(f"  Files processed: {len(typescript_files)}")
    print(f"  Files changed: {total_files_changed}")
    print(f"  Total replacements: {total_changes}")
    
    if total_files_changed == 0:
        print("  No changes needed - all files are already up to date!")

if __name__ == "__main__":
    main()
