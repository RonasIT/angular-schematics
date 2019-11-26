export function serializeJson(json: any): string {
  return `${JSON.stringify(json, null, 2)}\n`;
}
