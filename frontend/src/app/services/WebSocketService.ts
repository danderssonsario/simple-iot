import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private webSocket!: WebSocket;
  private messageHandlers: ((message: any) => void)[] = [];

  public connect(url: string): void {
    this.webSocket = new WebSocket(url);

    this.webSocket.onopen = (event) => {
      console.log('WebSocket connection opened:', event);
    };

    this.webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messageHandlers.forEach((handler) => handler(message));
    };

    this.webSocket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    this.webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  public sendMessage(message: any): void {
    if (this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket connection is not open.');
    }
  }

  public addMessageHandler(handler: (message: any) => void): void {
    this.messageHandlers.push(handler);
  }

  public removeMessageHandler(handler: (message: any) => void): void {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }
}
