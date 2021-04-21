import express from "express";

export interface jwtUser extends express.Request {
    user?: any;
}