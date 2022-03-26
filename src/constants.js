/**
 * MAP RELATED
 */
export const MAP_WIDTH_TILE_COUNT = 80;
const MAP_ZOOM_MULTIPLIER = 4; // 400% zoom
const TILE_PIXEL_WIDTH = 12;
export const TILE_WIDTH = TILE_PIXEL_WIDTH * MAP_ZOOM_MULTIPLIER;
const TILE_PIXEL_HEIGHT = 12;
export const TILE_HEIGHT = TILE_PIXEL_HEIGHT * MAP_ZOOM_MULTIPLIER;

/**
 * PLAYER RELATED
 */
export const MOVEMENT_SPEED = 3;

/**
 * BATTLE RELATED
 */
export const PLAYER_AREA_AND_BATTLE_ZONE_OVERLAP_FACTOR = 0.4;
export const BATTLE_TRIGGER_PERCENTAGE = 0.01;
export const BATTLE_FLASH_DURATION = 0.4;
export const BATTLE_FLASH_REPEAT = 3;
