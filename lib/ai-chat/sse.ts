export function sseHeaders() {
  return {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  };
}

export function encodeSseEvent(event: unknown) {
  return `data: ${JSON.stringify(event)}\n\n`;
}
