"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryStates = void 0;
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
class MemoryStates {
    constructor(opts) {
        this.expiresInMS = (opts === null || opts === void 0 ? void 0 : opts.expiresInSec) !== undefined ? (opts === null || opts === void 0 ? void 0 : opts.expiresInSec) * 1000 : 180000;
        this.states = new Map();
    }
    clearAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this.states.clear();
        });
    }
    clearExpired(timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            const states = Array.from(this.states.entries());
            const ts = timestamp !== null && timestamp !== void 0 ? timestamp : +new Date();
            for (const [id, state] of states) {
                if (state.createdAt + this.expiresInMS < ts) {
                    this.states.delete(id);
                }
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw Error('No id supplied');
            }
            return this.states.delete(id);
        });
    }
    getAsserted(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw Error('No id supplied');
            }
            let result;
            if (yield this.has(id)) {
                result = (yield this.get(id));
            }
            if (!result) {
                throw new Error(oid4vci_common_1.STATE_MISSING_ERROR + ` (${id})`);
            }
            return result;
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.states.get(id);
        });
    }
    has(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw Error('No id supplied');
            }
            return this.states.has(id);
        });
    }
    set(id, stateValue) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw Error('No id supplied');
            }
            this.states.set(id, stateValue);
        });
    }
    startCleanupRoutine(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cleanupIntervalId) {
                this.cleanupIntervalId = setInterval(() => this.clearExpired(), timeout !== null && timeout !== void 0 ? timeout : 30000);
            }
        });
    }
    stopCleanupRoutine() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cleanupIntervalId) {
                clearInterval(this.cleanupIntervalId);
            }
        });
    }
}
exports.MemoryStates = MemoryStates;
//# sourceMappingURL=MemoryStates.js.map