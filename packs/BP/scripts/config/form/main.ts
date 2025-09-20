import {
  AchievementForm,
  ActionForm,
  Behavior,
  ModalForm,
} from "../../modules/class/form";

export const mainForm = "main"; // Define the broom form ID here

export default [
  new ActionForm("main", {
    title: "sb_th.form.main.title",
    description: ["sb_th.form.main.description.1"],
    iconPath: "",
  }),

  // MAIN CATEGORIES

  new ActionForm("thirst", {
    title: "sb_th.form.thirst.title",
    iconPath: "textures/sb/th/ui/droplet_full",
    description: ["sb_th.form.thirst.description.1"],
    references: ["main"],
  }),
  new ActionForm("items", {
    title: "sb_th.form.items.title",
    iconPath: "textures/sb/th/items/flask_full",
    description: ["sb_th.form.items.description.1"],
    references: ["main"],
  }),

  // THIRST

  new ActionForm("salt_water", {
    title: "sb_th.form.salt_water.title",
    iconPath: "textures/sb/th/ui/salt_water_bottle",
    description: [
      "sb_th.form.salt_water.description.1",
      "",
      "sb_th.form.salt_water.description.2",
    ],
    references: ["thirst"],
  }),
  new ActionForm("purified_water", {
    title: "sb_th.form.purified_water.title",
    iconPath: "textures/sb/th/ui/purified_water_bottle",
    description: ["sb_th.form.purified_water.description.1"],
    references: ["thirst"],
    wikiInfo: { thirst: +3 },
  }),
  new ActionForm("water_purifier", {
    title: "sb_th.form.water_purifier.title",
    iconPath: "textures/sb/th/ui/water_purifier_bottle",
    description: ["sb_th.form.water_purifier.description.1"],
    references: ["salt_water"],
    wikiInfo: { hasCraftingTableRecipe: true },
  }),
  new ActionForm("berry_juice", {
    title: "sb_th.form.berry_juice.title",
    iconPath: "textures/sb/th/ui/berry_juice_bottle",
    description: ["sb_th.form.berry_juice.description.1"],
    references: ["thirst"],
    wikiInfo: { thirst: +4 },
  }),
  new ActionForm("cactus_juice", {
    title: "sb_th.form.cactus_juice.title",
    iconPath: "textures/sb/th/ui/cactus_juice_bottle",
    description: ["sb_th.form.cactus_juice.description.1"],
    references: ["thirst"],
    wikiInfo: { thirst: +5 },
  }),

  // ITEMS

  new ActionForm("flask", {
    title: "sb_th.form.flask.title",
    iconPath: "textures/sb/th/items/flask_full",
    description: ["sb_th.form.flask.description.1"],
    references: ["items"],
    wikiInfo: {
      capacity: 3,
      hasCraftingTableRecipe: true,
    },
  }),
];
