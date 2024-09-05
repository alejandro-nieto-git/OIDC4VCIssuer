"use strict";
// noinspection ES6MissingAwait
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
exports.LookupStateManager = void 0;
class LookupStateManager {
    constructor(keyValueMapper, valueStateManager, lookup) {
        this.keyValueMapper = keyValueMapper;
        this.valueStateManager = valueStateManager;
        this.lookup = lookup;
    }
    startCleanupRoutine(timeout) {
        this.keyValueMapper.startCleanupRoutine(timeout);
        return this.valueStateManager.startCleanupRoutine(timeout);
    }
    stopCleanupRoutine() {
        this.keyValueMapper.stopCleanupRoutine();
        return this.valueStateManager.stopCleanupRoutine();
    }
    clearAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this.keyValueMapper.clearAll();
            this.valueStateManager.clearAll();
        });
    }
    clearExpired(timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            this.keyValueMapper.clearExpired(timestamp);
            this.valueStateManager.clearExpired(timestamp);
        });
    }
    assertedValueId(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const prop = this.lookup;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const valueId = yield this.keyValueMapper.getAsserted(key).then((keyState) => (prop in keyState ? keyState[prop] : undefined));
            if (typeof valueId !== 'string') {
                throw Error('no value id could be derived for key' + key);
            }
            return valueId;
        });
    }
    valueId(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return (yield this.keyValueMapper.get(key).then((keyState) => (prop in keyState ? keyState[prop] : undefined)));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.assertedValueId(id).then((value) => __awaiter(this, void 0, void 0, function* () {
                yield this.keyValueMapper.delete(id);
                return this.valueStateManager.delete(value);
            }));
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.valueId(id).then((value) => (value ? this.valueStateManager.get(value) : undefined));
        });
    }
    has(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.valueId(id).then((value) => (value ? this.valueStateManager.has(value) : false));
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    set(id, stateValue) {
        return __awaiter(this, void 0, void 0, function* () {
            throw Error(`Please use the set method that accepts both and id, value and object`);
        });
    }
    setMapped(id, keyValue, stateValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.keyValueMapper.set(id, keyValue);
            yield this.valueStateManager.set(id, stateValue);
        });
    }
    getAsserted(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.assertedValueId(id).then((value) => this.valueStateManager.getAsserted(value));
        });
    }
}
exports.LookupStateManager = LookupStateManager;
//# sourceMappingURL=LookupStateManager.js.map