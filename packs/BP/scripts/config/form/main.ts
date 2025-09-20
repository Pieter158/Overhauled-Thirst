import {
  AchievementForm,
  ActionForm,
  Behavior,
  ModalForm,
} from "../../modules/class/form";

export const mainForm = "main"; // Define the broom form ID here

export default [
  new ActionForm("main", {
    title: "sb_ob.form.main.title",
    description: [],
    iconPath: "",
  }),

  // MAIN CATEGORIES

  new ActionForm("foliage", {
    title: "sb_ob.form.foliage.title",
    iconPath: "textures/sb/ob/blocks/sapling/maple_sapling",
    description: ["sb_ob.form.foliage.description.1"],
    references: ["main"],
  }),
  new ActionForm("mobs", {
    title: "sb_ob.form.mobs.title",
    iconPath: "textures/sb/ob/items/animals/spawn_eggs/deer.png",
    description: ["sb_ob.form.mobs.description.1"],
    references: ["main"],
  }),
  new ActionForm("potions", {
    title: "sb_ob.form.potions.title",
    description: ["sb_ob.form.potions.description"],
    iconPath: "textures/items/potion_bottle_heal",
    references: ["main"],
  }),
  new ActionForm("mining", {
    title: "sb_ob.form.mining.title",
    iconPath: "textures/sb/ob/ui/deepshard_debris",
    description: ["sb_ob.form.mining.description.1"],
    references: ["main"],
  }),
  new ActionForm("structures_quests", {
    title: "sb_ob.form.structures_quests.title",
    iconPath: "textures/sb/ob/items/quest_forest",
    description: ["sb_ob.form.structures_quests.description.1"],
    references: ["main"],
  }),

  // INDIVIDUAL POTIONS
  new ActionForm("maple_syrup_potion", {
    title: "sb_ob.form.maple_syrup_potion.title",
    description: [
      "sb_ob.form.maple_syrup_potion.description",
      "sb_ob.form.maple_syrup_potion.description.2",
      "",
      "sb_ob.form.maple_syrup_potion.description.4",
    ],
    iconPath: "textures/sb/ob/items/potions/maple_syrup_potion",
    references: ["potions"],
  }),
  new ActionForm("double_jump_potion", {
    title: "sb_ob.form.double_jump_potion.title",
    description: [
      "sb_ob.form.double_jump_potion.description",
      "sb_ob.form.double_jump_potion.description.2",
      "",
      "sb_ob.form.double_jump_potion.description.4",
      "sb_ob.form.double_jump_potion.description.5",
    ],
    iconPath: "textures/sb/ob/items/potions/double_jump_potion",
    references: ["potions"],
  }),

  new ActionForm("swimming_speed_potion", {
    title: "sb_ob.form.swimming_speed_potion.title",
    description: [
      "sb_ob.form.swimming_speed_potion.description",
      "sb_ob.form.swimming_speed_potion.description.2",
      "",
      "sb_ob.form.swimming_speed_potion.description.4",
      "sb_ob.form.swimming_speed_potion.description.5",
    ],
    iconPath: "textures/sb/ob/items/potions/swimming_speed_potion",
    references: ["potions"],
  }),

  new ActionForm("lava_walker_potion", {
    title: "sb_ob.form.lava_walker_potion.title",
    description: [
      "sb_ob.form.lava_walker_potion.description",
      "sb_ob.form.lava_walker_potion.description.2",
      "",
      "sb_ob.form.lava_walker_potion.description.4",
      "sb_ob.form.lava_walker_potion.description.5",
    ],
    iconPath: "textures/sb/ob/items/potions/lava_walker_potion",
    references: ["potions"],
  }),

  new ActionForm("frost_walker_potion", {
    title: "sb_ob.form.frost_walker_potion.title",
    description: [
      "sb_ob.form.frost_walker_potion.description",
      "sb_ob.form.frost_walker_potion.description.2",
      "",
      "sb_ob.form.frost_walker_potion.description.4",
      "sb_ob.form.frost_walker_potion.description.5",
    ],
    iconPath: "textures/sb/ob/items/potions/frost_walker_potion",
    references: ["potions"],
  }),

  new ActionForm("mining_potion", {
    title: "sb_ob.form.mining_potion.title",
    description: [
      "sb_ob.form.mining_potion.description",
      "sb_ob.form.mining_potion.description.2",
      "",
      "sb_ob.form.mining_potion.description.4",
      "sb_ob.form.mining_potion.description.5",
    ],
    iconPath: "textures/sb/ob/items/potions/mining_potion",
    references: ["potions"],
  }),

  new ActionForm("lumberjack_potion", {
    title: "sb_ob.form.lumberjack_potion.title",
    description: [
      "sb_ob.form.lumberjack_potion.description",
      "sb_ob.form.lumberjack_potion.description.2",
      "",
      "sb_ob.form.lumberjack_potion.description.4",
      "sb_ob.form.lumberjack_potion.description.5",
    ],
    iconPath: "textures/sb/ob/items/potions/lumberjack_potion",
    references: ["potions"],
  }),

  new ActionForm("digging_potion", {
    title: "sb_ob.form.digging_potion.title",
    description: [
      "sb_ob.form.digging_potion.description",
      "sb_ob.form.digging_potion.description.2",
      "",
      "sb_ob.form.digging_potion.description.4",
      "sb_ob.form.digging_potion.description.5",
    ],
    iconPath: "textures/sb/ob/items/potions/digging_potion",
    references: ["potions"],
  }),

  new ActionForm("community_and_updates", {
    title: "sb_ob.form.community_and_updates.title",
    iconPath: "textures/sb/ob/ui/logo",
    description: [
      "sb_ob.form.community_and_updates.description.1",
      "",
      "sb_ob.form.community_and_updates.description.2",
      "",
      "sb_ob.form.community_and_updates.description.3",
      "",
      "sb_ob.form.community_and_updates.description.4",
    ],
    references: ["main"],
  }),

  // new ActionForm("settings", {
  //   title: "sb_ob.form.settings.title",
  //   description: ["sb_ob.form.settings.description"],
  //   iconPath: "",
  //   references: ["main"],
  // }),

  new ModalForm("mob_spawning", {
    title: "sb_ob.form.mob_spawning.title",
    iconPath: "",
    description: ["sb_ob.form.mob_spawning.description"],

    references: ["mobs"],
    controls: [
      {
        type: "toggle",
        label: "entity.sb_ob:lion.name",
        defaultValue: true,
        dynamicProperty: "allowSpawning_sb_ob:lion",
      },
      {
        type: "toggle",
        label: "entity.sb_ob:tiger.name",
        defaultValue: true,
        dynamicProperty: "allowSpawning_sb_ob:tiger",
      },
      {
        type: "toggle",
        label: "entity.sb_ob:crocodile.name",
        defaultValue: true,
        dynamicProperty: "allowSpawning_sb_ob:crocodile",
      },
      {
        type: "toggle",
        label: "entity.sb_ob:jungle_skeleton.name",
        defaultValue: true,
        dynamicProperty: "allowSpawning_sb_ob:jungle_skeleton",
      },
      {
        type: "toggle",
        label: "entity.sb_ob:rhino.name",
        defaultValue: true,
        dynamicProperty: "allowSpawning_sb_ob:rhino",
      },
      {
        type: "toggle",
        label: "entity.sb_ob:bear.name",
        defaultValue: true,
        dynamicProperty: "allowSpawning_sb_ob:bear",
      },
      {
        type: "toggle",
        label: "entity.sb_ob:zebra.name",
        defaultValue: true,
        dynamicProperty: "allowSpawning_sb_ob:zebra",
      },
      {
        type: "toggle",
        label: "entity.sb_ob:buffalo.name",
        defaultValue: true,
        dynamicProperty: "allowSpawning_sb_ob:buffalo",
      },
      {
        type: "toggle",
        label: "entity.sb_ob:butterfly.name",
        defaultValue: true,
        dynamicProperty: "allowSpawning_sb_ob:butterfly",
      },
      {
        type: "toggle",
        label: "entity.sb_ob:deer.name",
        defaultValue: true,
        dynamicProperty: "allowSpawning_sb_ob:deer",
      },
      {
        type: "toggle",
        label: "entity.sb_ob:toucan.name",
        defaultValue: true,
        dynamicProperty: "allowSpawning_sb_ob:toucan",
      },
      {
        type: "toggle",
        label: "entity.sb_ob:flamingo.name",
        defaultValue: true,
        dynamicProperty: "allowSpawning_sb_ob:flamingo",
      },
    ],
  }),

  // BIOMES

  new ActionForm("trees", {
    title: "sb_ob.form.trees.title",
    iconPath: "textures/sb/ob/blocks/sapling/baobab_sapling",
    description: ["sb_ob.form.trees.description.1"],
    references: ["foliage"],
  }),
  new ActionForm("plants", {
    title: "sb_ob.form.plants.title",
    iconPath: "textures/sb/ob/items/foliage/clover_patch",
    description: ["sb_ob.form.plants.description.1"],
    references: ["foliage"],
  }),
  new ActionForm("nature_blocks", {
    title: "sb_ob.form.nature_blocks.title",
    iconPath: "textures/sb/ob/ui/silt_combined",
    description: ["sb_ob.form.nature_blocks.description.1"],
    references: ["foliage"],
  }),

  // MOB DROPS
  new ActionForm("pink_feather", {
    title: "item.sb_ob:pink_feather",
    iconPath: "textures/sb/ob/items/animals/drops/flamingo_feather",
    description: ["sb_ob.form.pink_feather.description.1"],
    references: ["mob_flamingo"],
    wikiInfo: {
      hasCraftingTableRecipe: false,
    },
  }),
  new ActionForm("crocodile_tooth", {
    title: "item.sb_ob:crocodile_tooth",
    iconPath: "textures/sb/ob/items/animals/drops/crocodile_tooth",
    description: ["sb_ob.form.crocodile_tooth.description.1"],
    references: ["mob_crocodile"],
    wikiInfo: {
      hasCraftingTableRecipe: false,
    },
  }),
  new ActionForm("fishbone", {
    title: "item.sb_ob:fishbone",
    iconPath: "textures/sb/ob/items/animals/drops/fishbone",
    description: ["sb_ob.form.fishbone.description.1"],
    references: ["mob_piranha"],
    wikiInfo: {
      hasCraftingTableRecipe: false,
    },
  }),
  new ActionForm("wild_meat", {
    title: "item.sb_ob:wild_meat",
    iconPath: "textures/sb/ob/items/animals/food/raw_wild_meat",
    description: ["sb_ob.form.wild_meat.description.1"],
    references: [
      "mob_buffalo",
      "mob_crocodile",
      "mob_lion",
      "mob_rhino",
      "mob_tiger",
    ],
    wikiInfo: {
      hasCraftingTableRecipe: false,
    },
  }),

  // ITEMS
  new ActionForm("fishbone_dagger", {
    title: "item.sb_ob:fishbone_dagger",
    iconPath: "textures/sb/ob/items/tools/fishbone_dagger",
    description: ["sb_ob.form.fishbone_dagger.description.1"],
    references: ["fishbone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),
  new ActionForm("deepshard_scrap", {
    title: "item.sb_ob:deepshard_scrap",
    iconPath: "textures/sb/ob/items/deepshard_scrap",
    description: ["sb_ob.form.deepshard_scrap.description.1"],
    references: ["deepshard"],
    wikiInfo: {
      hasCraftingTableRecipe: false,
    },
  }),

  // ORE BLOCKS
  new ActionForm("block_of_cobalt", {
    title: "tile.sb_ob:cobalt_block.name",
    iconPath: "textures/sb/ob/ui/block_of_cobalt",
    description: ["sb_ob.form.block_of_cobalt.description.1"],
    references: ["cobalt"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),
  new ActionForm("block_of_ruby", {
    title: "tile.sb_ob:ruby_block.name",
    iconPath: "textures/sb/ob/ui/block_of_ruby",
    description: ["sb_ob.form.block_of_ruby.description.1"],
    references: ["ruby"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),
  new ActionForm("block_of_deepshard", {
    title: "tile.sb_ob:deepshard_block.name",
    iconPath: "textures/sb/ob/ui/block_of_deepshard",
    description: ["sb_ob.form.block_of_deepshard.description.1"],
    references: ["deepshard"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),

  // FOLIAGE/PLANTS
  new ActionForm("clover_patch", {
    title: "tile.sb_ob:clover_patch.name",
    iconPath: "textures/sb/ob/items/foliage/clover_patch",
    description: ["sb_ob.form.clover_patch.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["forest", "jungle", "swamp"] },
  }),
  new ActionForm("succulent", {
    title: "tile.sb_ob:succulent.name",
    iconPath: "textures/sb/ob/blocks/foliage/succulent",
    description: ["sb_ob.form.succulent.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["jungle", "swamp"] },
  }),
  new ActionForm("mycelium_sprouts", {
    title: "tile.sb_ob:mycelium_sprouts.name",
    iconPath: "textures/sb/ob/blocks/foliage/mycelium_sprouts",
    description: ["sb_ob.form.mycelium_sprouts.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["mushrooms"] },
  }),
  new ActionForm("fungal_sprouts", {
    title: "tile.sb_ob:fungal_sprouts.name",
    iconPath: "textures/sb/ob/blocks/foliage/fungal_sprouts",
    description: ["sb_ob.form.fungal_sprouts.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["mushrooms"] },
  }),
  new ActionForm("pebbles", {
    title: "tile.sb_ob:pebbles.name",
    iconPath: "textures/sb/ob/items/foliage/pebbles",
    description: ["sb_ob.form.pebbles.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["forest", "swamp"] },
  }),
  new ActionForm("shells", {
    title: "tile.sb_ob:shells.name",
    iconPath: "textures/sb/ob/blocks/foliage/shells",
    description: ["sb_ob.form.shells.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["beach"] },
  }),
  new ActionForm("small_flowering_cactus", {
    title: "tile.sb_ob:small_flowering_cactus.name",
    iconPath: "textures/sb/ob/blocks/foliage/small_flowering_cactus",
    description: ["sb_ob.form.small_flowering_cactus.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["desert"] },
  }),
  new ActionForm("small_cactus", {
    title: "tile.sb_ob:small_cactus.name",
    iconPath: "textures/sb/ob/blocks/foliage/small_cactus",
    description: ["sb_ob.form.small_cactus.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["desert"] },
  }),
  new ActionForm("cave_mushroom", {
    title: "tile.sb_ob:cave_mushroom.name",
    iconPath: "textures/sb/ob/blocks/foliage/cave_mushroom",
    description: ["sb_ob.form.cave_mushroom.description.1"],
    references: ["plants"],
    wikiInfo: {
      biomes: ["mushrooms"],
      hasCraftingTableRecipe: true,
      stonecutter: "cave_mushroom",
    },
  }),
  new ActionForm("cave_mushroom_patch", {
    title: "tile.sb_ob:cave_mushroom_patch.name",
    iconPath: "textures/sb/ob/blocks/foliage/cave_mushroom_patch",
    description: ["sb_ob.form.cave_mushroom_patch.description.1"],
    references: ["plants"],
    wikiInfo: {
      biomes: ["mushrooms"],
      hasCraftingTableRecipe: true,
    },
  }),
  new ActionForm("cave_mushroom_block", {
    title: "tile.sb_ob:cave_mushroom_block.name",
    iconPath: "textures/sb/ob/blocks/foliage/cave_mushroom_block",
    description: ["sb_ob.form.cave_mushroom_block.description.1"],
    references: ["cave_mushroom", "cave_mushroom_patch"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),
  new ActionForm("brown_mushroom_patch", {
    title: "tile.sb_ob:brown_mushroom_patch.name",
    iconPath: "textures/sb/ob/blocks/foliage/brown_mushroom_patch",
    description: ["sb_ob.form.brown_mushroom_patch.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["mushrooms"] },
  }),
  new ActionForm("red_mushroom_patch", {
    title: "tile.sb_ob:red_mushroom_patch.name",
    iconPath: "textures/sb/ob/blocks/foliage/red_mushroom_patch",
    description: ["sb_ob.form.red_mushroom_patch.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["mushrooms"] },
  }),
  new ActionForm("wall_mushrooms", {
    title: "tile.sb_ob:wall_mushrooms.name",
    iconPath: "textures/sb/ob/blocks/foliage/wall_mushrooms",
    description: ["sb_ob.form.wall_mushrooms.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["forest"] },
  }),
  new ActionForm("curled_jungle_grass", {
    title: "tile.sb_ob:curled_jungle_grass.name",
    iconPath: "textures/sb/ob/blocks/foliage/curled_jungle_grass",
    description: ["sb_ob.form.curled_jungle_grass.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["jungle"] },
  }),
  new ActionForm("jungle_fern", {
    title: "tile.sb_ob:jungle_fern.name",
    iconPath: "textures/sb/ob/blocks/foliage/jungle_fern",
    description: ["sb_ob.form.jungle_fern.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["jungle"] },
  }),
  new ActionForm("orange_jungle_flower", {
    title: "tile.sb_ob:orange_jungle_flower.name",
    iconPath: "textures/sb/ob/items/foliage/orange_jungle_flower",
    description: ["sb_ob.form.orange_jungle_flower.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["jungle"] },
  }),
  new ActionForm("purple_jungle_flower", {
    title: "tile.sb_ob:purple_jungle_flower.name",
    iconPath: "textures/sb/ob/blocks/foliage/purple_jungle_flower",
    description: ["sb_ob.form.purple_jungle_flower.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["jungle"] },
  }),
  new ActionForm("tall_jungle_ferns", {
    title: "tile.sb_ob:tall_jungle_ferns.name",
    iconPath: "textures/sb/ob/blocks/foliage/tall_jungle_ferns",
    description: ["sb_ob.form.tall_jungle_ferns.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["jungle"] },
  }),
  new ActionForm("oat_grass", {
    title: "tile.sb_ob:oat_grass.name",
    iconPath: "textures/sb/ob/items/foliage/oat_grass",
    description: ["sb_ob.form.oat_grass.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["forest", "savannah"] },
  }),
  new ActionForm("lupines_purple", {
    title: "tile.sb_ob:lupines_purple.name",
    iconPath: "textures/sb/ob/items/foliage/lupines_purple",
    description: ["sb_ob.form.lupines_purple.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["forest", "plains"] },
  }),
  new ActionForm("lupines_red", {
    title: "tile.sb_ob:lupines_red.name",
    iconPath: "textures/sb/ob/items/foliage/lupines_red",
    description: ["sb_ob.form.lupines_red.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["forest", "plains"] },
  }),
  new ActionForm("lupines_white", {
    title: "tile.sb_ob:lupines_white.name",
    iconPath: "textures/sb/ob/items/foliage/lupines_white",
    description: ["sb_ob.form.lupines_white.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["forest", "plains"] },
  }),
  new ActionForm("lupines_orange", {
    title: "tile.sb_ob:lupines_orange.name",
    iconPath: "textures/sb/ob/items/foliage/lupines_orange",
    description: ["sb_ob.form.lupines_orange.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["forest", "plains"] },
  }),
  new ActionForm("lupines_magenta", {
    title: "tile.sb_ob:lupines_magenta.name",
    iconPath: "textures/sb/ob/items/foliage/lupines_magenta",
    description: ["sb_ob.form.lupines_magenta.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["forest", "plains"] },
  }),
  new ActionForm("lupines_yellow", {
    title: "tile.sb_ob:lupines_yellow.name",
    iconPath: "textures/sb/ob/items/foliage/lupines_yellow",
    description: ["sb_ob.form.lupines_yellow.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["forest", "plains"] },
  }),
  new ActionForm("beachgrass", {
    title: "tile.sb_ob:beachgrass.name",
    iconPath: "textures/sb/ob/blocks/foliage/beachgrass",
    description: ["sb_ob.form.beachgrass.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["beach"] },
  }),
  new ActionForm("cattails", {
    title: "tile.sb_ob:cattails.name",
    iconPath: "textures/sb/ob/blocks/foliage/cattails.top",
    description: ["sb_ob.form.cattails.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["swamp"] },
  }),
  new ActionForm("reed", {
    title: "tile.sb_ob:reed.name",
    iconPath: "textures/sb/ob/blocks/foliage/reed.top",
    description: ["sb_ob.form.reed.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["swamp"] },
  }),
  new ActionForm("duckweed", {
    title: "tile.sb_ob:duckweed.name",
    iconPath: "textures/sb/ob/blocks/foliage/duckweed",
    description: ["sb_ob.form.duckweed.description.1"],
    references: ["plants"],
    wikiInfo: { biomes: ["swamp"] },
  }),

  new ActionForm("blocks", {
    title: "sb_ob.form.blocks.title",
    iconPath: "textures/sb/ob/blocks/silt/silt_bricks",
    description: ["sb_ob.form.blocks.description.1"],
    references: ["content"],
  }),

  new ActionForm("armor", {
    title: "sb_ob.form.armor.title",
    iconPath: "textures/sb/ob/items/armor/oak_wooden/oak_wooden_chestplate",
    description: ["sb_ob.form.armor.description.1"],
    references: ["items"],
  }),

  new ActionForm("mobs", {
    title: "sb_ob.form.mobs.title",
    iconPath: "textures/sb/ob/items/animals/spawn_eggs/deer.png",
    description: ["sb_ob.form.mobs.description.1"],
    references: ["content"],
  }),
  new ActionForm("settings", {
    title: "sb_ob.form.settings.title",
    description: ["sb_ob.form.settings.description"],
    iconPath: "",
    references: ["content"],
  }),

  // BLOCK CATEGORIES
  new ActionForm("wood", {
    title: "sb_ob.form.wood.title",
    iconPath: "textures/sb/ob/ui/planks_combined",
    description: ["sb_ob.form.wood.description.1"],
    references: ["nature_blocks"],
  }),
  new ActionForm("silt", {
    title: "sb_ob.form.silt.title",
    iconPath: "textures/sb/ob/ui/silt_combined",
    description: ["sb_ob.form.silt.description.1"],
    references: ["nature_blocks"],
  }),
  new ActionForm("mud", {
    title: "sb_ob.form.mud.title",
    iconPath: "textures/sb/ob/ui/mud_combined",
    description: ["sb_ob.form.mud.description.1"],
    references: ["nature_blocks"],
  }),
  new ActionForm("blackstone", {
    title: "sb_ob.form.blackstone.title",
    iconPath: "textures/sb/ob/ui/blackstone_combined",
    description: ["sb_ob.form.blackstone.description.1"],
    references: ["nature_blocks"],
  }),
  new ActionForm("tuff", {
    title: "sb_ob.form.tuff.title",
    iconPath: "textures/sb/ob/ui/tuff_combined",
    description: ["sb_ob.form.tuff.description.1"],
    references: ["nature_blocks"],
  }),
  new ActionForm("sandstone", {
    title: "sb_ob.form.sandstone.title",
    iconPath: "textures/sb/ob/ui/sandstone_combined",
    description: ["sb_ob.form.sandstone.description.1"],
    references: ["nature_blocks"],
  }),
  new ActionForm("red_sandstone", {
    title: "sb_ob.form.red_sandstone.title",
    iconPath: "textures/sb/ob/ui/red_sandstone_combined",
    description: ["sb_ob.form.red_sandstone.description.1"],
    references: ["nature_blocks"],
  }),
  new ActionForm("stone", {
    title: "sb_ob.form.stone.title",
    iconPath: "textures/sb/ob/ui/stone_combined",
    description: ["sb_ob.form.stone.description.1"],
    references: ["nature_blocks"],
  }),
  new ActionForm("deepslate", {
    title: "sb_ob.form.deepslate.title",
    iconPath: "textures/sb/ob/ui/deepslate_combined",
    description: ["sb_ob.form.deepslate.description.1"],
    references: ["nature_blocks"],
  }),
  new ActionForm("limestone", {
    title: "sb_ob.form.limestone.title",
    iconPath: "textures/sb/ob/ui/limestone_combined",
    description: ["sb_ob.form.limestone.description.1"],
    references: ["nature_blocks"],
  }),
  new ActionForm("calcite", {
    title: "sb_ob.form.calcite.title",
    iconPath: "textures/sb/ob/ui/calcite_combined",
    description: ["sb_ob.form.calcite.description.1"],
    references: ["nature_blocks"],
  }),
  new ActionForm("sunstone", {
    title: "sb_ob.form.sunstone.title",
    iconPath: "textures/sb/ob/ui/sunstone_combined",
    description: ["sb_ob.form.sunstone.description.1"],
    references: ["nature_blocks"],
  }),
  new ActionForm("granite", {
    title: "sb_ob.form.granite.title",
    iconPath: "textures/sb/ob/ui/granite_combined",
    description: ["sb_ob.form.granite.description.1"],
    references: ["nature_blocks"],
  }),
  new ActionForm("diorite", {
    title: "sb_ob.form.diorite.title",
    iconPath: "textures/sb/ob/ui/diorite_combined",
    description: ["sb_ob.form.diorite.description.1"],
    references: ["nature_blocks"],
  }),
  new ActionForm("andesite", {
    title: "sb_ob.form.andesite.title",
    iconPath: "textures/sb/ob/ui/andesite_combined",
    description: ["sb_ob.form.andesite.description.1"],
    references: ["nature_blocks"],
  }),
  new ActionForm("cold", {
    title: "sb_ob.form.cold.title",
    iconPath: "textures/sb/ob/ui/cold_combined",
    description: ["sb_ob.form.cold.description.1"],
    references: ["nature_blocks"],
  }),

  new ActionForm("crates", {
    title: "sb_ob.form.crates.title",
    iconPath: "textures/sb/ob/ui/crates_combined",
    description: ["sb_ob.form.crates.description.1"],
    references: ["blocks"],
  }),

  new ActionForm("ruby", {
    title: "sb_ob.form.ruby.title",
    iconPath: "textures/sb/ob/items/ruby",
    description: ["sb_ob.form.ruby.mining", "", "sb_ob.form.ruby.crafting"],
    references: ["mining", "lumberjack_potion"],
    wikiInfo: {
      biomes: ["underground"],
    },
  }),
  new ActionForm("deepshard", {
    title: "sb_ob.form.deepshard.title",
    iconPath: "textures/sb/ob/items/deepshard_ingot",
    description: [
      "sb_ob.form.deepshard.mining",
      "sb_ob.form.deepshard.crafting",
    ],
    references: ["mining"],
    wikiInfo: {
      biomes: ["underground"],
    },
  }),

  // DEEPSHARD TOOLS AND ARMOR
  new ActionForm("deepshard_tools", {
    title: "sb_ob.form.deepshard_tools.title",
    iconPath: "textures/sb/ob/items/tools/deepshard_pickaxe",
    description: ["sb_ob.form.deepshard_tools.description"],
    references: ["deepshard"],
  }),

  new ActionForm("deepshard_armor", {
    title: "sb_ob.form.deepshard_armor.title",
    iconPath: "textures/sb/ob/items/armor/deepshard/deepshard_chestplate",
    description: ["sb_ob.form.deepshard_armor.description"],
    references: ["deepshard"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),

  // FURNITURE
  new ActionForm("square_basket_planks", {
    title: "sb_ob.form.square_basket_planks.title",
    iconPath: "textures/sb/ob/ui/maple_square_basket_planks",
    description: [
      "sb_ob.form.square_basket_planks.description.1",
      "",
      "sb_ob.wood_variants",
    ],
    references: ["solidblocks_furniture"],
    wikiInfo: {
      stonecutter: "itemGroup.name.planks",
    },
  }),

  new ActionForm("herringbone_planks", {
    title: "sb_ob.form.herringbone_planks.title",
    iconPath: "textures/sb/ob/ui/maple_herringbone_planks",
    description: [
      "sb_ob.form.herringbone_planks.description.1",
      "",
      "sb_ob.wood_variants",
    ],
    references: ["solidblocks_furniture"],
    wikiInfo: {
      stonecutter: "itemGroup.name.planks",
    },
  }),

  new ActionForm("wide_planks", {
    title: "sb_ob.form.wide_planks.title",
    iconPath: "textures/sb/ob/ui/maple_wide_planks",
    description: [
      "sb_ob.form.wide_planks.description.1",
      "",
      "sb_ob.wood_variants",
    ],
    references: ["solidblocks_furniture"],
    wikiInfo: {
      stonecutter: "itemGroup.name.planks",
    },
  }),

  new ActionForm("tiled_planks", {
    title: "sb_ob.form.tiled_planks.title",
    iconPath: "textures/sb/ob/ui/maple_tiled_planks",
    description: [
      "sb_ob.form.tiled_planks.description.1",
      "",
      "sb_ob.wood_variants",
    ],
    references: ["solidblocks_furniture"],
    wikiInfo: {
      stonecutter: "itemGroup.name.planks",
    },
  }),

  new ActionForm("special_fence", {
    title: "sb_ob.form.special_fence.title",
    iconPath: "textures/sb/ob/ui/maple_special_fence",
    description: [
      "sb_ob.form.special_fence.description.1",
      "",
      "sb_ob.wood_variants",
    ],
    references: ["solidblocks_furniture"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),

  new ActionForm("special_fence_gate", {
    title: "sb_ob.form.special_fence_gate.title",
    iconPath: "textures/sb/ob/ui/maple_special_fence_gate",
    description: [
      "sb_ob.form.special_fence_gate.description.1",
      "",
      "sb_ob.wood_variants",
    ],
    references: ["solidblocks_furniture"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),

  new ActionForm("shutter", {
    title: "sb_ob.form.shutter.title",
    iconPath: "textures/sb/ob/ui/maple_shutter",
    description: [
      "sb_ob.form.shutter.description.1",
      "",
      "sb_ob.wood_variants",
    ],
    references: ["solidblocks_furniture"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),

  new ActionForm("glass_door", {
    title: "sb_ob.form.glass_door.title",
    iconPath: "textures/sb/ob/ui/maple_glass_door",
    description: [
      "sb_ob.form.glass_door.description.1",
      "",
      "sb_ob.wood_variants",
    ],
    references: ["solidblocks_furniture"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),

  new ActionForm("glass_trap_door", {
    title: "sb_ob.form.glass_trap_door.title",
    iconPath: "textures/sb/ob/ui/maple_glass_trapdoor",
    description: [
      "sb_ob.form.glass_trap_door.description.1",
      "",
      "sb_ob.wood_variants",
    ],
    references: ["solidblocks_furniture"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),
  new ActionForm("chair", {
    title: "sb_ob.form.chair.title",
    iconPath: "textures/sb/ob/ui/maple_chair",
    description: ["sb_ob.form.chair.description.1", "", "sb_ob.wood_variants"],
    references: ["solidblocks_furniture"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),

  new ActionForm("stool", {
    title: "sb_ob.form.stool.title",
    iconPath: "textures/sb/ob/ui/maple_stool",
    description: ["sb_ob.form.stool.description.1", "", "sb_ob.wood_variants"],
    references: ["solidblocks_furniture"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),

  new ActionForm("shelf", {
    title: "sb_ob.form.shelf.title",
    iconPath: "textures/sb/ob/ui/maple_shelf",
    description: ["sb_ob.form.shelf.description.1", "", "sb_ob.wood_variants"],
    references: ["solidblocks_furniture"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),

  new ActionForm("counter", {
    title: "sb_ob.form.counter.title",
    iconPath: "textures/sb/ob/ui/maple_counter",
    description: [
      "sb_ob.form.counter.description.1",
      "",
      "sb_ob.wood_variants",
    ],
    references: ["solidblocks_furniture"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),

  new ActionForm("door_cabinets", {
    title: "sb_ob.form.door_cabinets.title",
    iconPath: "textures/sb/ob/ui/maple_door_cabinet",
    description: [
      "sb_ob.form.door_cabinets.description.1",
      "",
      "sb_ob.wood_variants",
    ],
    references: ["solidblocks_furniture"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),

  new ActionForm("drawer_cabinets", {
    title: "sb_ob.form.drawer_cabinets.title",
    iconPath: "textures/sb/ob/ui/maple_drawer_cabinet",
    description: [
      "sb_ob.form.drawer_cabinets.description.1",
      "",
      "sb_ob.wood_variants",
    ],
    references: ["solidblocks_furniture"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),

  // INDIVIDUAL DEEPSHARD TOOLS
  new ActionForm("deepshard_pickaxe", {
    title: "sb_ob.form.deepshard_pickaxe.title",
    iconPath: "textures/sb/ob/items/tools/deepshard_pickaxe",
    description: [
      "sb_ob.form.deepshard_pickaxe.description",
      "",
      "sb_ob.form.deepshard_pickaxe.durability",
    ],
    references: ["deepshard_tools"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),
  new ActionForm("deepshard_axe", {
    title: "sb_ob.form.deepshard_axe.title",
    iconPath: "textures/sb/ob/items/tools/deepshard_axe",
    description: [
      "sb_ob.form.deepshard_axe.description",
      "",
      "sb_ob.form.deepshard_axe.durability",
    ],
    references: ["deepshard_tools"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),
  new ActionForm("deepshard_hoe", {
    title: "sb_ob.form.deepshard_hoe.title",
    iconPath: "textures/sb/ob/items/tools/deepshard_hoe",
    description: [
      "sb_ob.form.deepshard_hoe.description",
      "",
      "sb_ob.form.deepshard_hoe.durability",
    ],
    references: ["deepshard_tools"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),
  new ActionForm("deepshard_sword", {
    title: "sb_ob.form.deepshard_sword.title",
    iconPath: "textures/sb/ob/items/tools/deepshard_sword",
    description: [
      "sb_ob.form.deepshard_sword.description",
      "",
      "sb_ob.form.deepshard_sword.durability",
    ],
    references: ["deepshard_tools"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),
  new ActionForm("deepshard_shovel", {
    title: "sb_ob.form.deepshard_shovel.title",
    iconPath: "textures/sb/ob/items/tools/deepshard_shovel",
    description: [
      "sb_ob.form.deepshard_shovel.description",
      "",
      "sb_ob.form.deepshard_shovel.durability",
    ],
    references: ["deepshard_tools"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),

  new ActionForm("cobalt", {
    title: "sb_ob.form.cobalt.title",
    iconPath: "textures/sb/ob/items/cobalt",
    description: ["sb_ob.form.cobalt.mining", "sb_ob.form.cobalt.crafting"],
    references: ["mining"],
    wikiInfo: {
      biomes: ["underground"],
    },
  }),

  // COBALT MAGNET
  new ActionForm("magnet_from_cobalt", {
    title: "sb_ob.form.magnet_from_cobalt.title",
    iconPath: "textures/sb/ob/items/magnet",
    description: [
      "sb_ob.form.magnet_from_cobalt.description",
      "sb_ob.form.magnet_from_cobalt.crafting",
    ],
    references: ["cobalt"],
  }),
  // SILT BLOCKS
  new ActionForm("wet_silt", {
    title: "sb_ob.form.wet_silt.title",
    iconPath: "textures/sb/ob/ui/wet_silt",
    description: ["sb_ob.form.wet_silt.description.1"],
    references: ["silt"],
  }),
  new ActionForm("dry_silt", {
    title: "sb_ob.form.dry_silt.title",
    iconPath: "textures/sb/ob/ui/dry_silt",
    description: ["sb_ob.form.dry_silt.description.1"],
    references: ["silt"],
  }),
  new ActionForm("silt_bricks", {
    title: "sb_ob.form.silt_bricks.title",
    iconPath: "textures/sb/ob/ui/silt_bricks",
    description: ["sb_ob.form.silt_bricks.description.1"],
    references: ["silt"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:silt_bricks.name",
    },
  }),
  new ActionForm("silt_brick_slabs", {
    title: "sb_ob.form.silt_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/silt_bricks_slab",
    description: ["sb_ob.form.silt_brick_slabs.description.1"],
    references: ["silt"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:silt_bricks.name",
    },
  }),
  new ActionForm("silt_brick_stairs", {
    title: "sb_ob.form.silt_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/silt_bricks_stairs",
    description: ["sb_ob.form.silt_brick_stairs.description.1"],
    references: ["silt"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:silt_bricks.name",
    },
  }),
  new ActionForm("silt_bricks_wall", {
    title: "sb_ob.form.silt_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/silt_bricks_wall",
    description: ["sb_ob.form.silt_bricks_wall.description.1"],
    references: ["silt"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:silt_bricks.name",
    },
  }),
  new ActionForm("thin_silt_bricks", {
    title: "sb_ob.form.thin_silt_bricks.title",
    iconPath: "textures/sb/ob/ui/thin_silt_bricks",
    description: ["sb_ob.form.thin_silt_bricks.description.1"],
    references: ["silt"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:silt_bricks.name",
    },
  }),
  new ActionForm("thin_silt_brick_slabs", {
    title: "sb_ob.form.thin_silt_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/thin_silt_slab",
    description: ["sb_ob.form.thin_silt_brick_slabs.description.1"],
    references: ["silt"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:silt_bricks.name",
    },
  }),
  new ActionForm("thin_silt_brick_stairs", {
    title: "sb_ob.form.thin_silt_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/thin_silt_stairs",
    description: ["sb_ob.form.thin_silt_brick_stairs.description.1"],
    references: ["silt"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:silt_bricks.name",
    },
  }),
  new ActionForm("thin_silt_bricks_wall", {
    title: "sb_ob.form.thin_silt_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/thin_silt_bricks_wall",
    description: ["sb_ob.form.thin_silt_bricks_wall.description.1"],
    references: ["silt"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:silt_bricks.name",
    },
  }),
  new ActionForm("silt_pillar", {
    title: "sb_ob.form.silt_pillar.title",
    iconPath: "textures/sb/ob/ui/silt_pillar",
    description: ["sb_ob.form.silt_pillar.description.1"],
    references: ["silt"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:silt_bricks.name",
    },
  }),

  // BLACKSTONE BLOCKS
  new ActionForm("thin_blackstone_bricks", {
    title: "sb_ob.form.thin_blackstone_bricks.title",
    iconPath: "textures/sb/ob/ui/thin_blackstone_bricks",
    description: ["sb_ob.form.thin_blackstone_bricks.description.1"],
    references: ["blackstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.blackstone.name",
    },
  }),
  new ActionForm("thin_blackstone_brick_slabs", {
    title: "sb_ob.form.thin_blackstone_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/thin_blackstone_slab",
    description: ["sb_ob.form.thin_blackstone_brick_slabs.description.1"],
    references: ["blackstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.blackstone.name",
    },
  }),
  new ActionForm("thin_blackstone_brick_stairs", {
    title: "sb_ob.form.thin_blackstone_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/thin_blackstone_stairs",
    description: ["sb_ob.form.thin_blackstone_brick_stairs.description.1"],
    references: ["blackstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.blackstone.name",
    },
  }),
  new ActionForm("thin_blackstone_bricks_wall", {
    title: "sb_ob.form.thin_blackstone_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/thin_blackstone_bricks_wall",
    description: ["sb_ob.form.thin_blackstone_bricks_wall.description.1"],
    references: ["blackstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.blackstone.name",
    },
  }),
  new ActionForm("blackstone_pillar", {
    title: "sb_ob.form.blackstone_pillar.title",
    iconPath: "textures/sb/ob/ui/blackstone_pillar",
    description: ["sb_ob.form.blackstone_pillar.description.1"],
    references: ["blackstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.blackstone.name",
    },
  }),

  // SANDSTONE BLOCKS
  new ActionForm("sandstone_bricks", {
    title: "sb_ob.form.sandstone_bricks.title",
    iconPath: "textures/sb/ob/ui/sandstone_bricks",
    description: ["sb_ob.form.sandstone_bricks.description.1"],
    references: ["sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sandstone.name",
    },
  }),
  new ActionForm("sandstone_brick_slabs", {
    title: "sb_ob.form.sandstone_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/sandstone_bricks_slab",
    description: ["sb_ob.form.sandstone_brick_slabs.description.1"],
    references: ["sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sandstone.name",
    },
  }),
  new ActionForm("sandstone_brick_stairs", {
    title: "sb_ob.form.sandstone_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/sandstone_bricks_stairs",
    description: ["sb_ob.form.sandstone_brick_stairs.description.1"],
    references: ["sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sandstone.name",
    },
  }),
  new ActionForm("sandstone_bricks_wall", {
    title: "sb_ob.form.sandstone_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/sandstone_bricks_wall",
    description: ["sb_ob.form.sandstone_bricks_wall.description.1"],
    references: ["sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sandstone.name",
    },
  }),
  new ActionForm("thin_sandstone_bricks", {
    title: "sb_ob.form.thin_sandstone_bricks.title",
    iconPath: "textures/sb/ob/ui/thin_sandstone_bricks",
    description: ["sb_ob.form.thin_sandstone_bricks.description.1"],
    references: ["sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sandstone.name",
    },
  }),
  new ActionForm("thin_sandstone_brick_slabs", {
    title: "sb_ob.form.thin_sandstone_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/thin_sandstone_slab",
    description: ["sb_ob.form.thin_sandstone_brick_slabs.description.1"],
    references: ["sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sandstone.name",
    },
  }),
  new ActionForm("thin_sandstone_brick_stairs", {
    title: "sb_ob.form.thin_sandstone_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/thin_sandstone_stairs",
    description: ["sb_ob.form.thin_sandstone_brick_stairs.description.1"],
    references: ["sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sandstone.name",
    },
  }),
  new ActionForm("thin_sandstone_bricks_wall", {
    title: "sb_ob.form.thin_sandstone_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/thin_sandstone_bricks_wall",
    description: ["sb_ob.form.thin_sandstone_bricks_wall.description.1"],
    references: ["sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sandstone.name",
    },
  }),
  new ActionForm("sandstone_pillar", {
    title: "sb_ob.form.sandstone_pillar.title",
    iconPath: "textures/sb/ob/ui/sandstone_pillar",
    description: ["sb_ob.form.sandstone_pillar.description.1"],
    references: ["sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sandstone.name",
    },
  }),

  // RED SANDSTONE BLOCKS
  new ActionForm("red_sandstone_bricks", {
    title: "sb_ob.form.red_sandstone_bricks.title",
    iconPath: "textures/sb/ob/ui/red_sandstone_bricks",
    description: ["sb_ob.form.red_sandstone_bricks.description.1"],
    references: ["red_sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.red_sandstone.name",
    },
  }),
  new ActionForm("red_sandstone_brick_slabs", {
    title: "sb_ob.form.red_sandstone_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/red_sandstone_bricks_slab",
    description: ["sb_ob.form.red_sandstone_brick_slabs.description.1"],
    references: ["red_sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.red_sandstone.name",
    },
  }),
  new ActionForm("red_sandstone_brick_stairs", {
    title: "sb_ob.form.red_sandstone_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/red_sandstone_bricks_stairs",
    description: ["sb_ob.form.red_sandstone_brick_stairs.description.1"],
    references: ["red_sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.red_sandstone.name",
    },
  }),
  new ActionForm("red_sandstone_bricks_wall", {
    title: "sb_ob.form.red_sandstone_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/red_sandstone_bricks_wall",
    description: ["sb_ob.form.red_sandstone_bricks_wall.description.1"],
    references: ["red_sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.red_sandstone.name",
    },
  }),
  new ActionForm("thin_red_sandstone_bricks", {
    title: "sb_ob.form.thin_red_sandstone_bricks.title",
    iconPath: "textures/sb/ob/ui/thin_red_sandstone_bricks",
    description: ["sb_ob.form.thin_red_sandstone_bricks.description.1"],
    references: ["red_sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.red_sandstone.name",
    },
  }),
  new ActionForm("thin_red_sandstone_brick_slabs", {
    title: "sb_ob.form.thin_red_sandstone_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/thin_red_sandstone_slab",
    description: ["sb_ob.form.thin_red_sandstone_brick_slabs.description.1"],
    references: ["red_sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.red_sandstone.name",
    },
  }),
  new ActionForm("thin_red_sandstone_brick_stairs", {
    title: "sb_ob.form.thin_red_sandstone_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/thin_red_sandstone_stairs",
    description: ["sb_ob.form.thin_red_sandstone_brick_stairs.description.1"],
    references: ["red_sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.red_sandstone.name",
    },
  }),
  new ActionForm("thin_red_sandstone_bricks_wall", {
    title: "sb_ob.form.thin_red_sandstone_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/thin_red_sandstone_bricks_wall",
    description: ["sb_ob.form.thin_red_sandstone_bricks_wall.description.1"],
    references: ["red_sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.red_sandstone.name",
    },
  }),
  new ActionForm("red_sandstone_pillar", {
    title: "sb_ob.form.red_sandstone_pillar.title",
    iconPath: "textures/sb/ob/ui/red_sandstone_pillar",
    description: ["sb_ob.form.red_sandstone_pillar.description.1"],
    references: ["red_sandstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.red_sandstone.name",
    },
  }),

  // STONE BLOCKS
  new ActionForm("thin_stone_bricks", {
    title: "sb_ob.form.thin_stone_bricks.title",
    iconPath: "textures/sb/ob/ui/thin_stone_bricks",
    description: ["sb_ob.form.thin_stone_bricks.description.1"],
    references: ["stone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stonebrick.name",
    },
  }),
  new ActionForm("thin_stone_brick_slabs", {
    title: "sb_ob.form.thin_stone_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/thin_stone_slab",
    description: ["sb_ob.form.thin_stone_brick_slabs.description.1"],
    references: ["stone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stonebrick.name",
    },
  }),
  new ActionForm("thin_stone_brick_stairs", {
    title: "sb_ob.form.thin_stone_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/thin_stone_stairs",
    description: ["sb_ob.form.thin_stone_brick_stairs.description.1"],
    references: ["stone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stonebrick.name",
    },
  }),
  new ActionForm("thin_stone_bricks_wall", {
    title: "sb_ob.form.thin_stone_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/thin_stone_bricks_wall",
    description: ["sb_ob.form.thin_stone_bricks_wall.description.1"],
    references: ["stone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stonebrick.name",
    },
  }),
  new ActionForm("stone_pillar", {
    title: "sb_ob.form.stone_pillar.title",
    iconPath: "textures/sb/ob/ui/stone_pillar",
    description: ["sb_ob.form.stone_pillar.description.1"],
    references: ["stone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stonebrick.name",
    },
  }),

  // LIMESTONE BLOCKS
  new ActionForm("limestone_block", {
    title: "sb_ob.form.limestone_block.title",
    iconPath: "textures/sb/ob/ui/limestone",
    description: ["sb_ob.form.limestone_block.description.1"],
    references: ["limestone"],
    wikiInfo: { biomes: ["limestone"], hasCraftingTableRecipe: false },
  }),
  new ActionForm("limestone_slabs", {
    title: "sb_ob.form.limestone_slabs.title",
    iconPath: "textures/sb/ob/ui/limestone_slab",
    description: ["sb_ob.form.limestone_slabs.description.1"],
    references: ["limestone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:limestone.name",
    },
  }),
  new ActionForm("limestone_stairs", {
    title: "sb_ob.form.limestone_stairs.title",
    iconPath: "textures/sb/ob/ui/limestone_stairs",
    description: ["sb_ob.form.limestone_stairs.description.1"],
    references: ["limestone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:limestone.name",
    },
  }),
  new ActionForm("polished_limestone", {
    title: "sb_ob.form.polished_limestone.title",
    iconPath: "textures/sb/ob/ui/polished_limestone_bricks",
    description: ["sb_ob.form.polished_limestone.description.1"],
    references: ["limestone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:limestone.name",
    },
  }),
  new ActionForm("polished_limestone_slabs", {
    title: "sb_ob.form.polished_limestone_slabs.title",
    iconPath: "textures/sb/ob/ui/polished_limestone_slab",
    description: ["sb_ob.form.polished_limestone_slabs.description.1"],
    references: ["limestone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:limestone.name",
    },
  }),
  new ActionForm("polished_limestone_stairs", {
    title: "sb_ob.form.polished_limestone_stairs.title",
    iconPath: "textures/sb/ob/ui/polished_limestone_stairs",
    description: ["sb_ob.form.polished_limestone_stairs.description.1"],
    references: ["limestone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:limestone.name",
    },
  }),
  new ActionForm("limestone_bricks", {
    title: "sb_ob.form.limestone_bricks.title",
    iconPath: "textures/sb/ob/ui/limestone_bricks",
    description: ["sb_ob.form.limestone_bricks.description.1"],
    references: ["limestone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:limestone.name",
    },
  }),
  new ActionForm("limestone_brick_slabs", {
    title: "sb_ob.form.limestone_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/limestone_bricks_slab",
    description: ["sb_ob.form.limestone_brick_slabs.description.1"],
    references: ["limestone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:limestone.name",
    },
  }),
  new ActionForm("limestone_brick_stairs", {
    title: "sb_ob.form.limestone_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/limestone_bricks_stairs",
    description: ["sb_ob.form.limestone_brick_stairs.description.1"],
    references: ["limestone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:limestone.name",
    },
  }),
  new ActionForm("limestone_bricks_wall", {
    title: "sb_ob.form.limestone_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/limestone_bricks_wall",
    description: ["sb_ob.form.limestone_bricks_wall.description.1"],
    references: ["limestone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:limestone.name",
    },
  }),
  new ActionForm("thin_limestone_bricks", {
    title: "sb_ob.form.thin_limestone_bricks.title",
    iconPath: "textures/sb/ob/ui/thin_limestone_bricks",
    description: ["sb_ob.form.thin_limestone_bricks.description.1"],
    references: ["limestone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:limestone.name",
    },
  }),
  new ActionForm("thin_limestone_brick_slabs", {
    title: "sb_ob.form.thin_limestone_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/thin_limestone_slab",
    description: ["sb_ob.form.thin_limestone_brick_slabs.description.1"],
    references: ["limestone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:limestone.name",
    },
  }),
  new ActionForm("thin_limestone_brick_stairs", {
    title: "sb_ob.form.thin_limestone_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/thin_limestone_stairs",
    description: ["sb_ob.form.thin_limestone_brick_stairs.description.1"],
    references: ["limestone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:limestone.name",
    },
  }),
  new ActionForm("thin_limestone_bricks_wall", {
    title: "sb_ob.form.thin_limestone_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/thin_limestone_bricks_wall",
    description: ["sb_ob.form.thin_limestone_bricks_wall.description.1"],
    references: ["limestone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:limestone.name",
    },
  }),
  new ActionForm("limestone_pillar", {
    title: "sb_ob.form.limestone_pillar.title",
    iconPath: "textures/sb/ob/ui/limestone_pillar",
    description: ["sb_ob.form.limestone_pillar.description.1"],
    references: ["limestone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:limestone.name",
    },
  }),
  new ActionForm("polished_limestone_wall", {
    title: "sb_ob.form.polished_limestone_wall.title",
    iconPath: "textures/sb/ob/ui/polished_limestone_wall",
    description: ["sb_ob.form.polished_limestone_wall.description.1"],
    references: ["limestone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:limestone.name",
    },
  }),

  // GRANITE
  new ActionForm("polished_granite_wall", {
    title: "sb_ob.form.polished_granite_wall.title",
    iconPath: "textures/sb/ob/ui/polished_granite_wall",
    description: ["sb_ob.form.polished_granite_wall.description.1"],
    references: ["granite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.granite.name",
    },
  }),
  new ActionForm("granite_bricks", {
    title: "sb_ob.form.granite_bricks.title",
    iconPath: "textures/sb/ob/ui/granite_bricks",
    description: ["sb_ob.form.granite_bricks.description.1"],
    references: ["granite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.granite.name",
    },
  }),
  new ActionForm("granite_brick_slabs", {
    title: "sb_ob.form.granite_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/granite_bricks_slab",
    description: ["sb_ob.form.granite_brick_slabs.description.1"],
    references: ["granite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.granite.name",
    },
  }),
  new ActionForm("granite_brick_stairs", {
    title: "sb_ob.form.granite_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/granite_bricks_stairs",
    description: ["sb_ob.form.granite_brick_stairs.description.1"],
    references: ["granite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.granite.name",
    },
  }),
  new ActionForm("granite_bricks_wall", {
    title: "sb_ob.form.granite_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/granite_bricks_wall",
    description: ["sb_ob.form.granite_bricks_wall.description.1"],
    references: ["granite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.granite.name",
    },
  }),
  new ActionForm("thin_granite_bricks", {
    title: "sb_ob.form.thin_granite_bricks.title",
    iconPath: "textures/sb/ob/ui/thin_granite_bricks",
    description: ["sb_ob.form.thin_granite_bricks.description.1"],
    references: ["granite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.granite.name",
    },
  }),
  new ActionForm("thin_granite_brick_slabs", {
    title: "sb_ob.form.thin_granite_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/thin_granite_slab",
    description: ["sb_ob.form.thin_granite_brick_slabs.description.1"],
    references: ["granite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.granite.name",
    },
  }),
  new ActionForm("thin_granite_brick_stairs", {
    title: "sb_ob.form.thin_granite_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/thin_granite_stairs",
    description: ["sb_ob.form.thin_granite_brick_stairs.description.1"],
    references: ["granite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.granite.name",
    },
  }),
  new ActionForm("thin_granite_bricks_wall", {
    title: "sb_ob.form.thin_granite_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/thin_granite_bricks_wall",
    description: ["sb_ob.form.thin_granite_bricks_wall.description.1"],
    references: ["granite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.granite.name",
    },
  }),
  new ActionForm("granite_pillar", {
    title: "sb_ob.form.granite_pillar.title",
    iconPath: "textures/sb/ob/ui/granite_pillar",
    description: ["sb_ob.form.granite_pillar.description.1"],
    references: ["granite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.granite.name",
    },
  }),

  // DIORITE
  new ActionForm("polished_diorite_wall", {
    title: "sb_ob.form.polished_diorite_wall.title",
    iconPath: "textures/sb/ob/ui/polished_diorite_wall",
    description: ["sb_ob.form.polished_diorite_wall.description.1"],
    references: ["diorite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.diorite.name",
    },
  }),
  new ActionForm("diorite_bricks", {
    title: "sb_ob.form.diorite_bricks.title",
    iconPath: "textures/sb/ob/ui/diorite_bricks",
    description: ["sb_ob.form.diorite_bricks.description.1"],
    references: ["diorite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.diorite.name",
    },
  }),
  new ActionForm("diorite_brick_slabs", {
    title: "sb_ob.form.diorite_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/diorite_bricks_slab",
    description: ["sb_ob.form.diorite_brick_slabs.description.1"],
    references: ["diorite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.diorite.name",
    },
  }),
  new ActionForm("diorite_brick_stairs", {
    title: "sb_ob.form.diorite_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/diorite_bricks_stairs",
    description: ["sb_ob.form.diorite_brick_stairs.description.1"],
    references: ["diorite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.diorite.name",
    },
  }),
  new ActionForm("diorite_bricks_wall", {
    title: "sb_ob.form.diorite_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/diorite_bricks_wall",
    description: ["sb_ob.form.diorite_bricks_wall.description.1"],
    references: ["diorite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.diorite.name",
    },
  }),
  new ActionForm("thin_diorite_bricks", {
    title: "sb_ob.form.thin_diorite_bricks.title",
    iconPath: "textures/sb/ob/ui/thin_diorite_bricks",
    description: ["sb_ob.form.thin_diorite_bricks.description.1"],
    references: ["diorite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.diorite.name",
    },
  }),
  new ActionForm("thin_diorite_brick_slabs", {
    title: "sb_ob.form.thin_diorite_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/thin_diorite_slab",
    description: ["sb_ob.form.thin_diorite_brick_slabs.description.1"],
    references: ["diorite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.diorite.name",
    },
  }),
  new ActionForm("thin_diorite_brick_stairs", {
    title: "sb_ob.form.thin_diorite_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/thin_diorite_stairs",
    description: ["sb_ob.form.thin_diorite_brick_stairs.description.1"],
    references: ["diorite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.diorite.name",
    },
  }),
  new ActionForm("thin_diorite_bricks_wall", {
    title: "sb_ob.form.thin_diorite_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/thin_diorite_bricks_wall",
    description: ["sb_ob.form.thin_diorite_bricks_wall.description.1"],
    references: ["diorite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.diorite.name",
    },
  }),
  new ActionForm("diorite_pillar", {
    title: "sb_ob.form.diorite_pillar.title",
    iconPath: "textures/sb/ob/ui/diorite_pillar",
    description: ["sb_ob.form.diorite_pillar.description.1"],
    references: ["diorite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.diorite.name",
    },
  }),

  // ANDESITE
  new ActionForm("polished_andesite_wall", {
    title: "sb_ob.form.polished_andesite_wall.title",
    iconPath: "textures/sb/ob/ui/polished_andesite_wall",
    description: ["sb_ob.form.polished_andesite_wall.description.1"],
    references: ["andesite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.andesite.name",
    },
  }),
  new ActionForm("andesite_bricks", {
    title: "sb_ob.form.andesite_bricks.title",
    iconPath: "textures/sb/ob/ui/andesite_bricks",
    description: ["sb_ob.form.andesite_bricks.description.1"],
    references: ["andesite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.andesite.name",
    },
  }),
  new ActionForm("andesite_brick_slabs", {
    title: "sb_ob.form.andesite_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/andesite_bricks_slab",
    description: ["sb_ob.form.andesite_brick_slabs.description.1"],
    references: ["andesite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.andesite.name",
    },
  }),
  new ActionForm("andesite_brick_stairs", {
    title: "sb_ob.form.andesite_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/andesite_bricks_stairs",
    description: ["sb_ob.form.andesite_brick_stairs.description.1"],
    references: ["andesite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.andesite.name",
    },
  }),
  new ActionForm("andesite_bricks_wall", {
    title: "sb_ob.form.andesite_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/andesite_bricks_wall",
    description: ["sb_ob.form.andesite_bricks_wall.description.1"],
    references: ["andesite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.andesite.name",
    },
  }),
  new ActionForm("thin_andesite_bricks", {
    title: "sb_ob.form.thin_andesite_bricks.title",
    iconPath: "textures/sb/ob/ui/thin_andesite_bricks",
    description: ["sb_ob.form.thin_andesite_bricks.description.1"],
    references: ["andesite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.andesite.name",
    },
  }),
  new ActionForm("thin_andesite_brick_slabs", {
    title: "sb_ob.form.thin_andesite_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/thin_andesite_slab",
    description: ["sb_ob.form.thin_andesite_brick_slabs.description.1"],
    references: ["andesite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.andesite.name",
    },
  }),
  new ActionForm("thin_andesite_brick_stairs", {
    title: "sb_ob.form.thin_andesite_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/thin_andesite_stairs",
    description: ["sb_ob.form.thin_andesite_brick_stairs.description.1"],
    references: ["andesite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.andesite.name",
    },
  }),
  new ActionForm("thin_andesite_bricks_wall", {
    title: "sb_ob.form.thin_andesite_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/thin_andesite_bricks_wall",
    description: ["sb_ob.form.thin_andesite_bricks_wall.description.1"],
    references: ["andesite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.andesite.name",
    },
  }),
  new ActionForm("andesite_pillar", {
    title: "sb_ob.form.andesite_pillar.title",
    iconPath: "textures/sb/ob/ui/andesite_pillar",
    description: ["sb_ob.form.andesite_pillar.description.1"],
    references: ["andesite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.stone.andesite.name",
    },
  }),

  // CALCITE
  new ActionForm("calcite_slabs", {
    title: "sb_ob.form.calcite_slabs.title",
    iconPath: "textures/sb/ob/ui/calcite_slab",
    description: ["sb_ob.form.calcite_slabs.description.1"],
    references: ["calcite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.calcite.name",
    },
  }),
  new ActionForm("calcite_stairs", {
    title: "sb_ob.form.calcite_stairs.title",
    iconPath: "textures/sb/ob/ui/calcite_stairs",
    description: ["sb_ob.form.calcite_stairs.description.1"],
    references: ["calcite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.calcite.name",
    },
  }),
  new ActionForm("calcite_wall", {
    title: "sb_ob.form.calcite_wall.title",
    iconPath: "textures/sb/ob/ui/calcite_wall",
    description: ["sb_ob.form.calcite_wall.description.1"],
    references: ["calcite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.calcite.name",
    },
  }),
  new ActionForm("polished_calcite", {
    title: "sb_ob.form.polished_calcite.title",
    iconPath: "textures/sb/ob/ui/polished_calcite_bricks",
    description: ["sb_ob.form.polished_calcite.description.1"],
    references: ["calcite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.calcite.name",
    },
  }),
  new ActionForm("polished_calcite_slab", {
    title: "sb_ob.form.polished_calcite_slab.title",
    iconPath: "textures/sb/ob/ui/polished_calcite_slab",
    description: ["sb_ob.form.polished_calcite_slab.description.1"],
    references: ["calcite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.calcite.name",
    },
  }),
  new ActionForm("polished_calcite_stairs", {
    title: "sb_ob.form.polished_calcite_stairs.title",
    iconPath: "textures/sb/ob/ui/polished_calcite_stairs",
    description: ["sb_ob.form.polished_calcite_stairs.description.1"],
    references: ["calcite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.calcite.name",
    },
  }),
  new ActionForm("polished_calcite_wall", {
    title: "sb_ob.form.polished_calcite_wall.title",
    iconPath: "textures/sb/ob/ui/polished_calcite_wall",
    description: ["sb_ob.form.polished_calcite_wall.description.1"],
    references: ["calcite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.calcite.name",
    },
  }),
  new ActionForm("calcite_bricks", {
    title: "sb_ob.form.calcite_bricks.title",
    iconPath: "textures/sb/ob/ui/calcite_bricks",
    description: ["sb_ob.form.calcite_bricks.description.1"],
    references: ["calcite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.calcite.name",
    },
  }),
  new ActionForm("calcite_brick_slabs", {
    title: "sb_ob.form.calcite_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/calcite_bricks_slab",
    description: ["sb_ob.form.calcite_brick_slabs.description.1"],
    references: ["calcite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.calcite.name",
    },
  }),
  new ActionForm("calcite_brick_stairs", {
    title: "sb_ob.form.calcite_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/calcite_bricks_stairs",
    description: ["sb_ob.form.calcite_brick_stairs.description.1"],
    references: ["calcite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.calcite.name",
    },
  }),
  new ActionForm("calcite_bricks_wall", {
    title: "sb_ob.form.calcite_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/calcite_bricks_wall",
    description: ["sb_ob.form.calcite_bricks_wall.description.1"],
    references: ["calcite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.calcite.name",
    },
  }),
  new ActionForm("thin_calcite_bricks", {
    title: "sb_ob.form.thin_calcite_bricks.title",
    iconPath: "textures/sb/ob/ui/thin_calcite_bricks",
    description: ["sb_ob.form.thin_calcite_bricks.description.1"],
    references: ["calcite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.calcite.name",
    },
  }),
  new ActionForm("thin_calcite_brick_slabs", {
    title: "sb_ob.form.thin_calcite_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/thin_calcite_slab",
    description: ["sb_ob.form.thin_calcite_brick_slabs.description.1"],
    references: ["calcite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.calcite.name",
    },
  }),
  new ActionForm("thin_calcite_brick_stairs", {
    title: "sb_ob.form.thin_calcite_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/thin_calcite_stairs",
    description: ["sb_ob.form.thin_calcite_brick_stairs.description.1"],
    references: ["calcite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.calcite.name",
    },
  }),
  new ActionForm("thin_calcite_bricks_wall", {
    title: "sb_ob.form.thin_calcite_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/thin_calcite_bricks_wall",
    description: ["sb_ob.form.thin_calcite_bricks_wall.description.1"],
    references: ["calcite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.calcite.name",
    },
  }),
  new ActionForm("calcite_pillar", {
    title: "sb_ob.form.calcite_pillar.title",
    iconPath: "textures/sb/ob/ui/calcite_pillar",
    description: ["sb_ob.form.calcite_pillar.description.1"],
    references: ["calcite"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.calcite.name",
    },
  }),

  // SUNSTONE
  new ActionForm("sunstone_block", {
    title: "sb_ob.form.sunstone_block.title",
    iconPath: "textures/sb/ob/ui/sunstone",
    description: ["sb_ob.form.sunstone_block.description.1"],
    references: ["sunstone"],
    wikiInfo: {
      biomes: ["sunstone"],
      hasCraftingTableRecipe: false,
    },
  }),
  new ActionForm("sunstone_slabs", {
    title: "sb_ob.form.sunstone_slabs.title",
    iconPath: "textures/sb/ob/ui/sunstone_slab",
    description: ["sb_ob.form.sunstone_slabs.description.1"],
    references: ["sunstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:sunstone.name",
    },
  }),
  new ActionForm("sunstone_stairs", {
    title: "sb_ob.form.sunstone_stairs.title",
    iconPath: "textures/sb/ob/ui/sunstone_stairs",
    description: ["sb_ob.form.sunstone_stairs.description.1"],
    references: ["sunstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:sunstone.name",
    },
  }),
  new ActionForm("polished_sunstone", {
    title: "sb_ob.form.polished_sunstone.title",
    iconPath: "textures/sb/ob/ui/polished_sunstone_bricks",
    description: ["sb_ob.form.polished_sunstone.description.1"],
    references: ["sunstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:sunstone.name",
    },
  }),
  new ActionForm("polished_sunstone_slabs", {
    title: "sb_ob.form.polished_sunstone_slabs.title",
    iconPath: "textures/sb/ob/ui/polished_sunstone_slab",
    description: ["sb_ob.form.polished_sunstone_slabs.description.1"],
    references: ["sunstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:sunstone.name",
    },
  }),
  new ActionForm("polished_sunstone_stairs", {
    title: "sb_ob.form.polished_sunstone_stairs.title",
    iconPath: "textures/sb/ob/ui/polished_sunstone_stairs",
    description: ["sb_ob.form.polished_sunstone_stairs.description.1"],
    references: ["sunstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:sunstone.name",
    },
  }),
  new ActionForm("sunstone_bricks", {
    title: "sb_ob.form.sunstone_bricks.title",
    iconPath: "textures/sb/ob/ui/sunstone_bricks",
    description: ["sb_ob.form.sunstone_bricks.description.1"],
    references: ["sunstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:sunstone.name",
    },
  }),
  new ActionForm("sunstone_brick_slabs", {
    title: "sb_ob.form.sunstone_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/sunstone_bricks_slab",
    description: ["sb_ob.form.sunstone_brick_slabs.description.1"],
    references: ["sunstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:sunstone.name",
    },
  }),
  new ActionForm("sunstone_brick_stairs", {
    title: "sb_ob.form.sunstone_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/sunstone_bricks_stairs",
    description: ["sb_ob.form.sunstone_brick_stairs.description.1"],
    references: ["sunstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:sunstone.name",
    },
  }),
  new ActionForm("sunstone_bricks_wall", {
    title: "sb_ob.form.sunstone_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/sunstone_bricks_wall",
    description: ["sb_ob.form.sunstone_bricks_wall.description.1"],
    references: ["sunstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:sunstone.name",
    },
  }),
  new ActionForm("thin_sunstone_bricks", {
    title: "sb_ob.form.thin_sunstone_bricks.title",
    iconPath: "textures/sb/ob/ui/thin_sunstone_bricks",
    description: ["sb_ob.form.thin_sunstone_bricks.description.1"],
    references: ["sunstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:sunstone.name",
    },
  }),
  new ActionForm("thin_sunstone_brick_slabs", {
    title: "sb_ob.form.thin_sunstone_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/thin_sunstone_slab",
    description: ["sb_ob.form.thin_sunstone_brick_slabs.description.1"],
    references: ["sunstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:sunstone.name",
    },
  }),
  new ActionForm("thin_sunstone_brick_stairs", {
    title: "sb_ob.form.thin_sunstone_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/thin_sunstone_stairs",
    description: ["sb_ob.form.thin_sunstone_brick_stairs.description.1"],
    references: ["sunstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:sunstone.name",
    },
  }),
  new ActionForm("thin_sunstone_bricks_wall", {
    title: "sb_ob.form.thin_sunstone_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/thin_sunstone_bricks_wall",
    description: ["sb_ob.form.thin_sunstone_bricks_wall.description.1"],
    references: ["sunstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:sunstone.name",
    },
  }),
  new ActionForm("sunstone_pillar", {
    title: "sb_ob.form.sunstone_pillar.title",
    iconPath: "textures/sb/ob/ui/sunstone_pillar",
    description: ["sb_ob.form.sunstone_pillar.description.1"],
    references: ["sunstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:sunstone.name",
    },
  }),
  new ActionForm("polished_sunstone_wall", {
    title: "sb_ob.form.polished_sunstone_wall.title",
    iconPath: "textures/sb/ob/ui/polished_sunstone_wall",
    description: ["sb_ob.form.polished_sunstone_wall.description.1"],
    references: ["sunstone"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:sunstone.name",
    },
  }),

  // COLD (SNOW/ICE)
  new ActionForm("snow_bricks", {
    title: "sb_ob.form.snow_bricks.title",
    iconPath: "textures/sb/ob/ui/snow_bricks",
    description: ["sb_ob.form.snow_bricks.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.snow.name",
    },
  }),
  new ActionForm("snow_brick_slabs", {
    title: "sb_ob.form.snow_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/snow_bricks_slabs",
    description: ["sb_ob.form.snow_brick_slabs.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.snow.name",
    },
  }),
  new ActionForm("snow_brick_stairs", {
    title: "sb_ob.form.snow_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/snow_bricks_stairs",
    description: ["sb_ob.form.snow_brick_stairs.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.snow.name",
    },
  }),
  new ActionForm("snow_bricks_wall", {
    title: "sb_ob.form.snow_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/snow_bricks_wall",
    description: ["sb_ob.form.snow_bricks_wall.description.1"],
    references: ["snow"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.snow.name",
    },
  }),
  new ActionForm("thin_snow_bricks", {
    title: "sb_ob.form.thin_snow_bricks.title",
    iconPath: "textures/sb/ob/ui/thin_snow_bricks",
    description: ["sb_ob.form.thin_snow_bricks.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.snow.name",
    },
  }),
  new ActionForm("thin_snow_brick_slabs", {
    title: "sb_ob.form.thin_snow_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/thin_snow_slab",
    description: ["sb_ob.form.thin_snow_brick_slabs.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.snow.name",
    },
  }),
  new ActionForm("thin_snow_brick_stairs", {
    title: "sb_ob.form.thin_snow_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/thin_snow_stairs",
    description: ["sb_ob.form.thin_snow_brick_stairs.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.snow.name",
    },
  }),
  new ActionForm("thin_snow_bricks_wall", {
    title: "sb_ob.form.thin_snow_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/thin_snow_bricks_wall",
    description: ["sb_ob.form.thin_snow_bricks_wall.description.1"],
    references: ["snow"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.snow.name",
    },
  }),
  new ActionForm("snow_pillar", {
    title: "sb_ob.form.snow_pillar.title",
    iconPath: "textures/sb/ob/ui/snow_pillar",
    description: ["sb_ob.form.snow_pillar.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.snow.name",
    },
  }),
  new ActionForm("ice_bricks", {
    title: "sb_ob.form.ice_bricks.title",
    iconPath: "textures/sb/ob/ui/ice_bricks",
    description: ["sb_ob.form.ice_bricks.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.packed_ice.name",
    },
  }),
  new ActionForm("ice_brick_slabs", {
    title: "sb_ob.form.ice_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/ice_bricks_slabs",
    description: ["sb_ob.form.ice_brick_slabs.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.packed_ice.name",
    },
  }),
  new ActionForm("ice_brick_stairs", {
    title: "sb_ob.form.ice_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/ice_bricks_stairs",
    description: ["sb_ob.form.ice_brick_stairs.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.packed_ice.name",
    },
  }),
  new ActionForm("ice_bricks_wall", {
    title: "sb_ob.form.ice_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/ice_bricks_wall",
    description: ["sb_ob.form.ice_bricks_wall.description.1"],
    references: ["ice"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.packed_ice.name",
    },
  }),
  new ActionForm("snowy_ice_bricks", {
    title: "sb_ob.form.snowy_ice_bricks.title",
    iconPath: "textures/sb/ob/ui/snowy_ice_bricks",
    description: ["sb_ob.form.snowy_ice_bricks.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),
  new ActionForm("snowy_ice_brick_slabs", {
    title: "sb_ob.form.snowy_ice_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/snowy_ice_bricks_slabs",
    description: ["sb_ob.form.snowy_ice_brick_slabs.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:snowy_ice_bricks.name",
    },
  }),
  new ActionForm("snowy_ice_brick_stairs", {
    title: "sb_ob.form.snowy_ice_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/snowy_ice_bricks_stairs",
    description: ["sb_ob.form.snowy_ice_brick_stairs.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:snowy_ice_bricks.name",
    },
  }),
  new ActionForm("snowy_ice_bricks_wall", {
    title: "sb_ob.form.snowy_ice_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/snowy_ice_bricks_wall",
    description: ["sb_ob.form.snowy_ice_bricks_wall.description.1"],
    references: ["snowy_ice"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.sb_ob:snowy_ice_bricks.name",
    },
  }),
  new ActionForm("thin_ice_bricks", {
    title: "sb_ob.form.thin_ice_bricks.title",
    iconPath: "textures/sb/ob/ui/thin_ice_bricks",
    description: ["sb_ob.form.thin_ice_bricks.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.packed_ice.name",
    },
  }),
  new ActionForm("thin_ice_brick_slabs", {
    title: "sb_ob.form.thin_ice_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/thin_ice_slab",
    description: ["sb_ob.form.thin_ice_brick_slabs.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.packed_ice.name",
    },
  }),
  new ActionForm("thin_ice_brick_stairs", {
    title: "sb_ob.form.thin_ice_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/thin_ice_stairs",
    description: ["sb_ob.form.thin_ice_brick_stairs.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.packed_ice.name",
    },
  }),
  new ActionForm("thin_ice_bricks_wall", {
    title: "sb_ob.form.thin_ice_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/thin_ice_bricks_wall",
    description: ["sb_ob.form.thin_ice_bricks_wall.description.1"],
    references: ["ice"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.packed_ice.name",
    },
  }),
  new ActionForm("ice_pillar", {
    title: "sb_ob.form.ice_pillar.title",
    iconPath: "textures/sb/ob/ui/ice_pillar",
    description: ["sb_ob.form.ice_pillar.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.packed_ice.name",
    },
  }),
  new ActionForm("thin_ice", {
    title: "sb_ob.form.thin_ice.title",
    iconPath: "textures/sb/ob/ui/thin_ice",
    description: ["sb_ob.form.thin_ice.description.1"],
    references: ["cold"],
    wikiInfo: {
      hasCraftingTableRecipe: false,
      stonecutter: "tile.ice.name",
    },
  }),

  // DEEPSLATE
  new ActionForm("thin_deepslate_bricks", {
    title: "sb_ob.form.thin_deepslate_bricks.title",
    iconPath: "textures/sb/ob/ui/thin_deepslate_bricks",
    description: ["sb_ob.form.thin_deepslate_bricks.description.1"],
    references: ["deepslate"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.deepslate.name",
    },
  }),
  new ActionForm("thin_deepslate_brick_slabs", {
    title: "sb_ob.form.thin_deepslate_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/thin_deepslate_slab",
    description: ["sb_ob.form.thin_deepslate_brick_slabs.description.1"],
    references: ["deepslate"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.deepslate.name",
    },
  }),
  new ActionForm("thin_deepslate_brick_stairs", {
    title: "sb_ob.form.thin_deepslate_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/thin_deepslate_stairs",
    description: ["sb_ob.form.thin_deepslate_brick_stairs.description.1"],
    references: ["deepslate"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.deepslate.name",
    },
  }),
  new ActionForm("thin_deepslate_bricks_wall", {
    title: "sb_ob.form.thin_deepslate_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/thin_deepslate_bricks_wall",
    description: ["sb_ob.form.thin_deepslate_bricks_wall.description.1"],
    references: ["deepslate"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.deepslate.name",
    },
  }),
  new ActionForm("deepslate_pillar", {
    title: "sb_ob.form.deepslate_pillar.title",
    iconPath: "textures/sb/ob/ui/deepslate_pillar",
    description: ["sb_ob.form.deepslate_pillar.description.1"],
    references: ["deepslate"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.deepslate.name",
    },
  }),

  // TUFF
  new ActionForm("thin_tuff_bricks", {
    title: "sb_ob.form.thin_tuff_bricks.title",
    iconPath: "textures/sb/ob/ui/thin_tuff_bricks",
    description: ["sb_ob.form.thin_tuff_bricks.description.1"],
    references: ["tuff"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.tuff.name",
    },
  }),
  new ActionForm("thin_tuff_brick_slabs", {
    title: "sb_ob.form.thin_tuff_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/thin_tuff_slab",
    description: ["sb_ob.form.thin_tuff_brick_slabs.description.1"],
    references: ["tuff"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.tuff.name",
    },
  }),
  new ActionForm("thin_tuff_brick_stairs", {
    title: "sb_ob.form.thin_tuff_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/thin_tuff_stairs",
    description: ["sb_ob.form.thin_tuff_brick_stairs.description.1"],
    references: ["tuff"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.tuff.name",
    },
  }),
  new ActionForm("thin_tuff_bricks_wall", {
    title: "sb_ob.form.thin_tuff_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/thin_tuff_bricks_wall",
    description: ["sb_ob.form.thin_tuff_bricks_wall.description.1"],
    references: ["tuff"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.tuff.name",
    },
  }),
  new ActionForm("tuff_pillar", {
    title: "sb_ob.form.tuff_pillar.title",
    iconPath: "textures/sb/ob/ui/tuff_pillar",
    description: ["sb_ob.form.tuff_pillar.description.1"],
    references: ["tuff"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.tuff.name",
    },
  }),

  // MUD
  new ActionForm("thin_mud_bricks", {
    title: "sb_ob.form.thin_mud_bricks.title",
    iconPath: "textures/sb/ob/ui/thin_mud_bricks",
    description: ["sb_ob.form.thin_mud_bricks.description.1"],
    references: ["mud"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.mud_bricks.name",
    },
  }),
  new ActionForm("thin_mud_brick_slabs", {
    title: "sb_ob.form.thin_mud_brick_slabs.title",
    iconPath: "textures/sb/ob/ui/thin_mud_slab",
    description: ["sb_ob.form.thin_mud_brick_slabs.description.1"],
    references: ["mud"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.mud_bricks.name",
    },
  }),
  new ActionForm("thin_mud_brick_stairs", {
    title: "sb_ob.form.thin_mud_brick_stairs.title",
    iconPath: "textures/sb/ob/ui/thin_mud_stairs",
    description: ["sb_ob.form.thin_mud_brick_stairs.description.1"],
    references: ["mud"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.mud_bricks.name",
    },
  }),
  new ActionForm("thin_mud_bricks_wall", {
    title: "sb_ob.form.thin_mud_bricks_wall.title",
    iconPath: "textures/sb/ob/ui/thin_mud_bricks_wall",
    description: ["sb_ob.form.thin_mud_bricks_wall.description.1"],
    references: ["mud"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.mud_bricks.name",
    },
  }),
  new ActionForm("mud_pillar", {
    title: "sb_ob.form.mud_pillar.title",
    iconPath: "textures/sb/ob/ui/mud_pillar",
    description: ["sb_ob.form.mud_pillar.description.1"],
    references: ["mud"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
      stonecutter: "tile.mud_bricks.name",
    },
  }),

  // PLANKS - Direct from wood page, no separate pages needed
  new ActionForm("willow_planks", {
    title: "sb_ob.form.willow_planks.title",
    iconPath: "textures/sb/ob/ui/willow_planks.png",
    description: ["sb_ob.form.willow_planks.description.1"],
    references: ["wood", "willow"],
  }),
  new ActionForm("baobab_planks", {
    title: "sb_ob.form.baobab_planks.title",
    iconPath: "textures/sb/ob/ui/baobab_planks.png",
    description: ["sb_ob.form.baobab_planks.description.1"],
    references: ["wood", "baobab"],
  }),
  new ActionForm("maple_planks", {
    title: "sb_ob.form.maple_planks.title",
    iconPath: "textures/sb/ob/ui/maple_planks.png",
    description: ["sb_ob.form.maple_planks.description.1"],
    references: ["wood", "maple"],
  }),
  new ActionForm("palm_planks", {
    title: "sb_ob.form.palm_planks.title",
    iconPath: "textures/sb/ob/ui/palm_planks.png",
    description: ["sb_ob.form.palm_planks.description.1"],
    references: ["wood", "palm"],
  }),
  new ActionForm("redwood_planks", {
    title: "sb_ob.form.redwood_planks.title",
    iconPath: "textures/sb/ob/ui/redwood_planks.png",
    description: ["sb_ob.form.redwood_planks.description.1"],
    references: ["wood", "redwood"],
  }),
  new ActionForm("pine_planks", {
    title: "sb_ob.form.pine_planks.title",
    iconPath: "textures/sb/ob/ui/pine_planks.png",
    description: ["sb_ob.form.pine_planks.description.1"],
    references: ["wood", "pine"],
  }),
  new ActionForm("rain_forest_planks", {
    title: "sb_ob.form.rain_forest_planks.title",
    iconPath: "textures/sb/ob/ui/rain_forest_planks.png",
    description: ["sb_ob.form.rain_forest_planks.description.1"],
    references: ["wood", "rain_forest"],
  }),

  // TREES - Direct from trees page
  new ActionForm("willow", {
    title: "sb_ob.form.willow.title",
    iconPath: "textures/sb/ob/blocks/sapling/willow_sapling",
    description: [
      "sb_ob.form.willow.description.1",
      "",
      "sb_ob.form.willow.grows_in",
    ],
    references: ["trees"],
  }),
  new ActionForm("baobab", {
    title: "sb_ob.form.baobab.title",
    iconPath: "textures/sb/ob/blocks/sapling/baobab_sapling",
    description: [
      "sb_ob.form.baobab.description.1",
      "",
      "sb_ob.form.baobab.grows_in",
    ],
    references: ["trees"],
  }),
  new ActionForm("maple", {
    title: "sb_ob.form.maple.title",
    iconPath: "textures/sb/ob/blocks/sapling/maple_sapling",
    description: [
      "sb_ob.form.maple.description.1",
      "",
      "sb_ob.form.maple.grows_in",
    ],
    references: ["trees"],
  }),
  new ActionForm("structures_forest", {
    title: "sb_ob.form.structures_forest.title",
    iconPath: "",
    description: ["sb_ob.form.structures_forest.description.1"],
    references: ["forest"],
  }),
  new ActionForm("palm", {
    title: "sb_ob.form.palm.title",
    iconPath: "textures/sb/ob/blocks/sapling/palm_sapling",
    description: [
      "sb_ob.form.palm.description.1",
      "",
      "sb_ob.form.palm.grows_in",
    ],
    references: ["trees"],
  }),
  new ActionForm("redwood", {
    title: "sb_ob.form.redwood.title",
    iconPath: "textures/sb/ob/blocks/sapling/redwood_sapling",
    description: [
      "sb_ob.form.redwood.description.1",
      "",
      "sb_ob.form.redwood.grows_in",
    ],
    references: ["trees"],
  }),
  new ActionForm("pine", {
    title: "sb_ob.form.pine.title",
    iconPath: "textures/sb/ob/blocks/sapling/pine_sapling",
    description: [
      "sb_ob.form.pine.description.1",
      "",
      "sb_ob.form.pine.grows_in",
    ],
    references: ["trees"],
  }),
  new ActionForm("structures_taiga", {
    title: "sb_ob.form.structures_taiga.title",
    iconPath: "",
    description: ["sb_ob.form.structures_taiga.description.1"],
    references: ["taiga"],
  }),

  new ActionForm("rain_forest", {
    title: "sb_ob.form.rain_forest.title",
    iconPath: "textures/sb/ob/blocks/sapling/autumn_oak_sapling",
    description: [
      "sb_ob.form.rain_forest.description.1",
      "",
      "sb_ob.form.rain_forest.grows_in",
    ],
    references: ["trees"],
  }),

  // MOBS - Direct from mobs page, organized by behavior
  new ActionForm("mob_crocodile", {
    title: "entity.sb_ob:crocodile.name",
    iconPath: "textures/sb/ob/items/animals/spawn_eggs/crocodile",
    description: ["sb_ob.form.mob_crocodile.description.1"],
    references: ["mobs", "mobs_swamp", "mobs_jungle"],
    wikiInfo: {
      behavior: Behavior.HOSTILE,
      biomes: ["swamp", "jungle", "mangrove"],
      drops: ["item.sb_ob:wild_meat", "item.sb_ob:crocodile_tooth"],
      food: [
        "item.beef.name",
        "item.chicken.name",
        "item.muttonRaw.name",
        "item.porkchop.name",
        "item.rabbit.name",
        "item.fish.name",
        "item.salmon.name",
        "item.sb_ob:wild_meat",
      ],
      isBreedable: true,
      isTameable: false,
    },
  }),
  new ActionForm("mob_lion", {
    title: "entity.sb_ob:lion.name",
    iconPath: "textures/sb/ob/items/animals/spawn_eggs/lion",
    description: ["sb_ob.form.mob_lion.description.1"],
    references: ["mobs"],
    wikiInfo: {
      behavior: Behavior.HOSTILE,
      biomes: ["desert", "savannah"],
      drops: ["item.sb_ob:wild_meat"],
      food: [
        "item.beef.name",
        "item.chicken.name",
        "item.muttonRaw.name",
        "item.porkchop.name",
        "item.rabbit.name",
        "item.fish.name",
        "item.salmon.name",
        "item.sb_ob:wild_meat",
      ],
      isBreedable: true,
      isTameable: false,
    },
  }),
  new ActionForm("mob_tiger", {
    title: "entity.sb_ob:tiger.name",
    iconPath: "textures/sb/ob/items/animals/spawn_eggs/tiger",
    description: ["sb_ob.form.mob_tiger.description.1"],
    references: ["mobs"],
    wikiInfo: {
      behavior: Behavior.HOSTILE,
      biomes: ["jungle"],
      drops: ["item.sb_ob:wild_meat"],
      food: [
        "item.beef.name",
        "item.chicken.name",
        "item.muttonRaw.name",
        "item.porkchop.name",
        "item.rabbit.name",
        "item.fish.name",
        "item.salmon.name",
        "item.sb_ob:wild_meat",
      ],
      isBreedable: true,
      isTameable: false,
    },
  }),
  new ActionForm("mob_skeleton", {
    title: "entity.sb_ob:jungle_skeleton.name",
    iconPath: "textures/sb/ob/items/animals/spawn_eggs/jungle_skeleton",
    description: ["sb_ob.form.mob_jungle_skeleton.description.1"],
    references: ["mobs"],
    wikiInfo: {
      behavior: Behavior.HOSTILE,
      biomes: ["jungle"],
      drops: [
        "item.bone.name",
        "item.arrow.name",
        "item.bow.name",
        "tile.vines.name",
        "item.sb_ob:tribal_mask",
      ],
      food: [],
      isBreedable: false,
      isTameable: false,
    },
  }),
  new ActionForm("tribal_mask", {
    title: "sb_ob.form.tribal_mask.title",
    iconPath: "textures/sb/ob/items/armor/tribal_mask.png",
    description: ["sb_ob.form.tribal_mask.description.1"],
    references: ["mob_skeleton"],
    wikiInfo: {
      hasCraftingTableRecipe: false,
    },
  }),
  new ActionForm("mob_piranha", {
    title: "entity.sb_ob:piranha.name",
    iconPath: "textures/sb/ob/items/animals/spawn_eggs/piranha",
    description: ["sb_ob.form.mob_piranha.description.1"],
    references: ["mobs"],
    wikiInfo: {
      behavior: Behavior.HOSTILE,
      biomes: ["jungle", "swamp"],
      drops: ["item.sb_ob:fishbone"],
      isBreedable: false,
      isTameable: false,
    },
  }),
  new ActionForm("mob_robin", {
    title: "entity.sb_ob:robin.name",
    iconPath: "textures/sb/ob/items/animals/spawn_eggs/robin",
    description: ["sb_ob.form.mob_robin.description.1"],
    references: ["mobs"],
    wikiInfo: {
      behavior: Behavior.FRIENDLY,
      biomes: ["forest", "taiga"],
      drops: [],
      food: ["item.wheat_seeds.name"],
      isBreedable: true,
      isTameable: false,
    },
  }),
  new ActionForm("mob_rhino", {
    title: "entity.sb_ob:rhino.name",
    iconPath: "textures/sb/ob/items/animals/spawn_eggs/rhino",
    description: ["sb_ob.form.mob_rhino.description.1"],
    references: ["mobs"],
    wikiInfo: {
      behavior: Behavior.NEUTRAL,
      biomes: ["desert", "savannah"],
      drops: ["item.sb_ob:wild_meat"],
      food: ["tile.hay_block.name"],
      isBreedable: true,
      isTameable: false,
    },
  }),
  new ActionForm("mob_bear", {
    title: "entity.sb_ob:bear.name",
    iconPath: "textures/sb/ob/items/animals/spawn_eggs/bear",
    description: ["sb_ob.form.mob_bear.description.1"],
    references: ["mobs"],
    wikiInfo: {
      behavior: Behavior.NEUTRAL,
      biomes: ["forest", "taiga"],
      drops: ["item.sb_ob:fishbone"],
      food: ["item.honeycomb.name", "item.fish.name", "item.salmon.name"],
      isBreedable: false,
      isTameable: false,
    },
  }),
  new ActionForm("mob_zebra", {
    title: "entity.sb_ob:zebra.name",
    iconPath: "textures/sb/ob/items/animals/spawn_eggs/zebra",
    description: ["sb_ob.form.mob_zebra.description.1"],
    references: ["mobs"],
    wikiInfo: {
      behavior: Behavior.FRIENDLY,
      biomes: ["desert", "savannah"],
      drops: [],
      food: ["item.golden_apple.name", "item.golden_carrot.name"],
      isBreedable: true,
      isTameable: true,
    },
  }),
  new ActionForm("mob_buffalo", {
    title: "entity.sb_ob:buffalo.name",
    iconPath: "textures/sb/ob/items/animals/spawn_eggs/buffalo",
    description: ["sb_ob.form.mob_buffalo.description.1"],
    references: ["mobs"],
    wikiInfo: {
      behavior: Behavior.NEUTRAL,
      biomes: ["desert", "savannah"],
      drops: ["item.sb_ob:wild_meat"],
      food: ["item.wheat.name"],
      isBreedable: true,
      isTameable: false,
    },
  }),
  new ActionForm("mob_butterfly", {
    title: "entity.sb_ob:butterfly.name",
    iconPath: "textures/sb/ob/items/animals/spawn_eggs/butterfly",
    description: ["sb_ob.form.mob_butterfly.description.1"],
    references: ["mobs"],
    wikiInfo: {
      behavior: Behavior.FRIENDLY,
      biomes: ["forest", "jungle"],
      drops: [],
      food: [],
      isBreedable: false,
      isTameable: false,
    },
  }),
  new ActionForm("mob_deer", {
    title: "entity.sb_ob:deer.name",
    iconPath: "textures/sb/ob/items/animals/spawn_eggs/deer",
    description: ["sb_ob.form.mob_deer.description.1"],
    references: ["mobs"],
    wikiInfo: {
      behavior: Behavior.FRIENDLY,
      biomes: ["forest", "taiga"],
      drops: [],
      food: ["sb_ob.form.food.berry", "item.sb_ob:maple_syrup_potion"],
      isBreedable: true,
      isTameable: true,
    },
  }),
  new ActionForm("mob_toucan", {
    title: "entity.sb_ob:toucan.name",
    iconPath: "textures/sb/ob/items/animals/spawn_eggs/toucan",
    description: ["sb_ob.form.mob_toucan.description.1"],
    references: ["mobs"],
    wikiInfo: {
      behavior: Behavior.FRIENDLY,
      biomes: ["jungle"],
      drops: [],
      food: [],
      isBreedable: true,
      isTameable: true,
    },
  }),
  new ActionForm("mob_flamingo", {
    title: "entity.sb_ob:flamingo.name",
    iconPath: "textures/sb/ob/items/animals/spawn_eggs/flamingo",
    description: ["sb_ob.form.mob_flamingo.description.1"],
    references: ["mobs"],
    wikiInfo: {
      behavior: Behavior.FRIENDLY,
      biomes: ["swamp"],
      drops: ["item.sb_ob:pink_feather"],
      food: ["item.fish.name", "item.salmon.name"],
      isBreedable: true,
      isTameable: false,
    },
  }),

  // STRUCTURES SECTION
  new ActionForm("structure_snow_camp", {
    title: "sb_ob.form.structure_snow_camp.title",
    description: [
      "sb_ob.form.structure_snow_camp.description.1",
      "",
      "sb_ob.form.structure_snow_camp.quest_info",
    ],
    references: ["structures_quests"],
    wikiInfo: { biomes: ["snowy_plains", "snowy_taiga"] },
  }),
  new ActionForm("structure_mine", {
    title: "sb_ob.form.structure_mine.title",
    description: [
      "sb_ob.form.structure_mine.description.1",
      "",
      "sb_ob.form.structure_mine.quest_info",
    ],
    references: ["structures_quests"],
    wikiInfo: { biomes: ["plains"] },
  }),
  new ActionForm("structure_forest_camp", {
    title: "sb_ob.form.structure_forest_camp.title",
    description: [
      "sb_ob.form.structure_forest_camp.description.1",
      "",
      "sb_ob.form.structure_forest_camp.quest_info",
    ],
    references: ["structures_quests", "structures_forest", "structures_taiga"],
    wikiInfo: { biomes: ["forest", "taiga"] },
  }),
  new ActionForm("structure_taiga_abandoned", {
    title: "sb_ob.form.structure_taiga_abandoned.title",
    description: ["sb_ob.form.structure_taiga_abandoned.description.1"],
    references: ["structures_quests", "structures_taiga"],
    wikiInfo: { biomes: ["taiga"] },
  }),

  new ActionForm("structure_pillager_ship", {
    title: "sb_ob.form.structure_pillager_ship.title",
    description: ["sb_ob.form.structure_pillager_ship.description.1"],
    references: ["structures_quests"],
    wikiInfo: { biomes: ["ocean", "deep_ocean"] },
  }),

  new ActionForm("structure_windmill", {
    title: "sb_ob.form.structure_windmill.title",
    description: ["sb_ob.form.structure_windmill.description.1"],
    references: ["structures_quests"],
    wikiInfo: { biomes: ["sunflower_plains", "plains"] },
  }),
  new ActionForm("structure_watch_tower", {
    title: "sb_ob.form.structure_watch_tower.title",
    description: ["sb_ob.form.structure_watch_tower.description.1"],
    references: ["structures_quests", "structures_forest", "structures_taiga"],
    wikiInfo: { biomes: ["plains", "forest", "taiga", "savannah"] },
  }),
  new ActionForm("structure_abandoned_house", {
    title: "sb_ob.form.structure_abandoned_house.title",
    description: ["sb_ob.form.structure_abandoned_house.description.1"],
    references: ["structures_quests", "structures_forest", "structures_taiga"],
    wikiInfo: { biomes: ["taiga", "forest", "plains"] },
  }),
  new ActionForm("structure_temple", {
    title: "sb_ob.form.structure_temple.title",
    description: ["sb_ob.form.structure_temple.description.1"],
    references: ["structures_quests", "structures_jungle"],
    wikiInfo: { biomes: ["jungle"] },
  }),
  new ActionForm("structure_ruins", {
    title: "sb_ob.form.structure_ruins.title",
    description: ["sb_ob.form.structure_ruins.description.1"],
    references: [
      "structures_quests",
      "structures_forest",
      "structures_taiga",
      "structures_jungle",
    ],
    wikiInfo: { biomes: ["jungle", "forest", "taiga", "cold_taiga", "plains"] },
  }),
  new ActionForm("structure_desert_house", {
    title: "sb_ob.form.structure_desert_house.title",
    description: ["sb_ob.form.structure_desert_house.description.1"],
    references: ["structures_quests", "structures_desert"],
    wikiInfo: { biomes: ["desert"] },
  }),
  new ActionForm("structure_piramid", {
    title: "sb_ob.form.structure_piramid.title",
    description: ["sb_ob.form.structure_piramid.description.1"],
    references: ["structures_quests", "structures_desert"],
    wikiInfo: { biomes: ["desert"] },
  }),
  new ActionForm("structure_sunstone_ruin", {
    title: "sb_ob.form.structure_sunstone_ruin.title",
    description: ["sb_ob.form.structure_sunstone_ruin.description.1"],
    references: ["structures_quests", "structures_desert"],
    wikiInfo: { biomes: ["desert"] },
  }),
  new ActionForm("structure_witch_hut", {
    title: "sb_ob.form.structure_witch_hut.title",
    description: ["sb_ob.form.structure_witch_hut.description.1"],
    references: ["structures_quests", "structures_swamp"],
    wikiInfo: { biomes: ["swampland"] },
  }),

  new ActionForm("wooden_armor", {
    title: "sb_ob.form.wooden_armor.title",
    iconPath: "textures/sb/ob/items/armor/oak_wooden/oak_wooden_chestplate",
    description: ["sb_ob.form.wooden_armor.description.1"],
    references: ["foliage"],
    wikiInfo: {
      hasCraftingTableRecipe: true,
    },
  }),

  // PACKS SECTION
  new ActionForm("solidblocks_furniture", {
    title: "sb_ob.form.solidblocks_furniture.title",
    iconPath: "textures/sb/ob/ui/block_furniture",
    description: ["sb_ob.form.solidblocks_furniture.description.3"],
    references: ["community_and_updates"],
  }),
];
