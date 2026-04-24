import { Injectable, OnModuleInit } from "@nestjs/common";
import { toNodeHandler } from "better-auth/node";
import { IncomingMessage, ServerResponse } from "http";
import { PrismaService } from "../prisma/prisma.service";
import { AuthInstance, createAuth, setAuth } from "./auth.config";

@Injectable()
export class AuthService implements OnModuleInit {
  private _auth!: AuthInstance;

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    this._auth = createAuth(this.prisma);
    setAuth(this._auth);
  }

  get auth() {
    return this._auth;
  }

  get handler() {
    return toNodeHandler(this._auth);
  }

  async getSession(req: IncomingMessage) {
    // Convert Node.js IncomingHttpHeaders to the Fetch API Headers object
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      }
    }
    return this._auth.api.getSession({ headers });
  }
}
