"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationDetailsBuilder = void 0;
//todo: refactor this builder to be able to create ldp details as well
class AuthorizationDetailsBuilder {
    constructor() {
        this.authorizationDetails = {};
    }
    withType(type) {
        this.authorizationDetails.type = type;
        return this;
    }
    withFormats(format) {
        this.authorizationDetails.format = format;
        return this;
    }
    withLocations(locations) {
        if (this.authorizationDetails.locations) {
            this.authorizationDetails.locations.push(...locations);
        }
        else {
            this.authorizationDetails.locations = locations;
        }
        return this;
    }
    addLocation(location) {
        if (this.authorizationDetails.locations) {
            this.authorizationDetails.locations.push(location);
        }
        else {
            this.authorizationDetails.locations = [location];
        }
        return this;
    }
    //todo: we have to consider one thing, if this is a general purpose builder, we want to support ldp types here as well. and for that we need a few checks.
    buildJwtVcJson() {
        if (this.authorizationDetails.format && this.authorizationDetails.type) {
            return this.authorizationDetails;
        }
        throw new Error('Type and format are required properties');
    }
}
exports.AuthorizationDetailsBuilder = AuthorizationDetailsBuilder;
//# sourceMappingURL=AuthorizationDetailsBuilder.js.map