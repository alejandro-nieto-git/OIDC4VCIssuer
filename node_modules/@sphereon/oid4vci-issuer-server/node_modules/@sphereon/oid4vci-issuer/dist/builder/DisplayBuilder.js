"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayBuilder = void 0;
class DisplayBuilder {
    constructor() {
        this.additionalProperties = {};
    }
    withName(name) {
        this.name = name;
        return this;
    }
    withLocale(locale) {
        this.locale = locale;
        return this;
    }
    withLogo(logo) {
        if (logo) {
            if (!logo.url) {
                throw Error(`logo without url will not work`);
            }
        }
        this.logo = logo;
        return this;
    }
    withBackgroundColor(backgroundColor) {
        this.backgroundColor = backgroundColor;
        return this;
    }
    withTextColor(textColor) {
        this.textColor = textColor;
        return this;
    }
    withAdditionalProperties(properties) {
        this.additionalProperties = properties !== null && properties !== void 0 ? properties : {};
        return this;
    }
    addAdditionalProperty(key, value) {
        this.additionalProperties[key] = value;
        return this;
    }
    build() {
        return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, this.additionalProperties), (this.name && { name: this.name })), (this.locale && { locale: this.locale })), (this.logo && { logo: this.logo })), (this.backgroundColor && { background_color: this.backgroundColor })), (this.textColor && { text_color: this.textColor }));
    }
}
exports.DisplayBuilder = DisplayBuilder;
//# sourceMappingURL=DisplayBuilder.js.map