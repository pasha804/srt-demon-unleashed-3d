export type Spec = {
  id: string;
  label: string;
  value: string;
  unit: string;
  detail: string;
};

export const SPECS: Spec[] = [
  {
    id: "engine",
    label: "Engine",
    value: "6.2",
    unit: "L Supercharged HEMI V8",
    detail:
      "2.7-liter twin-screw supercharger force-feeds the 392 cubic-inch HEMI with 14.0 psi of boost.",
  },
  {
    id: "horsepower",
    label: "Horsepower",
    value: "808",
    unit: "HP @ 6300 RPM",
    detail: "840 horsepower on 100+ octane race fuel with the Direct Connection Demon Crate.",
  },
  {
    id: "torque",
    label: "Torque",
    value: "717",
    unit: "LB-FT @ 4500 RPM",
    detail: "Enough twist to lift the front wheels 2.92 feet off the pavement on launch.",
  },
  {
    id: "transmission",
    label: "Transmission",
    value: "8",
    unit: "Speed TorqueFlite Auto",
    detail: "Reinforced 8HP90 with a 1.9x torque converter and TransBrake staging.",
  },
  {
    id: "weight",
    label: "Weight",
    value: "4280",
    unit: "LBS Curb",
    detail: "232 lbs stripped from the Hellcat: no rear seat, no trunk trim, hollow sway bar.",
  },
  {
    id: "acceleration",
    label: "0 – 60",
    value: "2.3",
    unit: "Seconds",
    detail: "Street-legal drag radials and a 1.8 g launch. Certified NHRA 9-second quarter mile.",
  },
  {
    id: "topspeed",
    label: "Top Speed",
    value: "203",
    unit: "MPH",
    detail: "Limited by the drag radial rating — the aero and gearing have more left in them.",
  },
];

export const TIMELINE = [
  {
    year: "1969",
    title: "The Blueprint",
    copy: "Dodge signs off on a two-door personal luxury muscle coupe. The Challenger nameplate is born.",
  },
  {
    year: "1970",
    title: "First Blood",
    copy: "The E-body arrives with the 426 HEMI. 425 advertised horsepower and an attitude problem.",
  },
  {
    year: "2008",
    title: "Resurrection",
    copy: "The modern Challenger SRT8 returns. Retro silhouette, contemporary chassis, 425 HP.",
  },
  {
    year: "2015",
    title: "Hellcat Era",
    copy: "707 supercharged horsepower makes the Challenger the most powerful muscle car ever sold.",
  },
  {
    year: "2018",
    title: "Demon Born",
    copy: "840 HP. 9.65 second quarter mile. Banned by the NHRA on its first pass. Only 3,300 built.",
  },
  {
    year: "2023",
    title: "Last Call",
    copy: "The SRT Demon 170 closes the combustion chapter with 1,025 horsepower on E85.",
  },
];

export const ENGINE_HOTSPOTS = [
  {
    id: "supercharger",
    name: "2.7L Twin-Screw Supercharger",
    copy: "Largest displacement blower ever fitted to a production car. 14.0 psi of relentless boost.",
    x: 52,
    y: 22,
  },
  {
    id: "block",
    name: "Forged Rotating Assembly",
    copy: "Forged alloy pistons, powder-forged rods and a high-strength steel crank rated to 6500 RPM.",
    x: 34,
    y: 62,
  },
  {
    id: "cooling",
    name: "SRT Power Chiller",
    copy: "Diverts A/C refrigerant to the charge-air cooler, dropping intake temps below 100°F.",
    x: 72,
    y: 48,
  },
  {
    id: "fuel",
    name: "Dual Fuel Pumps",
    copy: "High-octane mode unlocks a second fuel pump and a race-calibrated engine map.",
    x: 63,
    y: 74,
  },
  {
    id: "trans",
    name: "TransBrake Driveline",
    copy: "Locks the output shaft so the converter can be loaded to 2350 RPM before launch.",
    x: 22,
    y: 36,
  },
];

export const PAINTS = [
  { id: "pitch", name: "Pitch Black", hex: "#0b0b0b", tint: "0deg" },
  { id: "torred", name: "TorRed", hex: "#c8102e", tint: "0deg" },
  { id: "frostbite", name: "Frostbite", hex: "#2f6f9f", tint: "205deg" },
  { id: "sinamon", name: "Sinamon Stick", hex: "#8a4b2a", tint: "25deg" },
  { id: "smoke", name: "Destroyer Grey", hex: "#6b6f72", tint: "0deg" },
];

export const WHEELS = [
  { id: "slick", name: "Nitto Drag Radial", size: '18" x 11"' },
  { id: "forged", name: "Forged Lightweight", size: '20" x 11"' },
  { id: "carbon", name: "Carbon Fiber Aero", size: '20" x 11.5"' },
];

export const CALIPERS = [
  { id: "red", name: "Demon Red", hex: "#d11217" },
  { id: "black", name: "Satin Black", hex: "#1a1a1a" },
  { id: "ember", name: "Ember Orange", hex: "#ff6b35" },
];
