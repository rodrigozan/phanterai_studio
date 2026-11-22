import type { LookT } from "../../schema/scenes";

export const FAMILIA: Record<"leo" | "neide" | "carlos" | "ze", { name: string; look: LookT }> = {
  leo: {
    name: "Léo",
    look: { build: "kid", height: 0.95, skinColor: "#F2C38B", skinSide: "#D9A66E", hairColor: "#4A2E1A", hairStyle: "short", browColor: "#151515", accessory: "cap", capColor: "#2F7FE0", capBrimColor: "#2459A8", shirtColor: "#2F7FE0", pantsColor: "#1F2A44", shoeColor: "#F5F5F5", mustache: false, belly: false, sleeveless: false, shorts: false, stoop: false, missingTooth: false, item: "none" },
  },
  neide: {
    name: "Dona Neide",
    look: { build: "adult", height: 1, skinColor: "#C68642", skinSide: "#A86E33", hairColor: "#2B1B12", hairStyle: "volume", accessory: "glasses", glassesColor: "#1A1A1A", blushColor: "#F08A8A", shirtColor: "#E85A5A", pantsColor: "#4B3A6B", mustache: false, belly: false, sleeveless: false, shorts: false, stoop: false, missingTooth: false, item: "phone", itemColor: "#7AD7F0" },
  },
  carlos: {
    name: "Seu Carlos",
    look: { build: "adult", height: 1.02, skinColor: "#E0AC69", skinSide: "#C4914F", hairColor: "#5A3A22", hairStyle: "bald-sides", accessory: "none", mustache: true, belly: true, sleeveless: true, shirtColor: "#F5F5F5", pantsColor: "#6B7A3A", shorts: true, shoeColor: "#2459A8", stoop: false, missingTooth: false, item: "remote" },
  },
  ze: {
    name: "Vô Zé",
    look: { build: "adult", height: 0.97, skinColor: "#D9A066", skinSide: "#BD8650", hairColor: "#C9C9C9", hairStyle: "bald-sides", browColor: "#EDEDED", accessory: "round-glasses", glassesColor: "#D4AF37", shirtColor: "#8B5A2B", shirtLineColor: "#5C3A1A", pantsColor: "#C8B48A", shoeColor: "#4A2E1A", mustache: false, belly: false, sleeveless: false, shorts: false, stoop: true, missingTooth: true, item: "cane", itemColor: "#8B5A2B" },
  },
};
