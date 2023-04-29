'use strict';

function getScopeParam(scope, scopeSeparator) {
  if (scope === undefined) {
    return null;
  }

  if (Array.isArray(scope)) {
    return {
      scope: scope.join(scopeSeparator),
    };
  }

  return {
    scope,
  };
}

module.exports = class GrantTypeParams {
  #params = null;
  #baseParams = null;
  #config = null;

  static forGrantType(grantType, config, params) {
    const baseParams = {
      grant_type: grantType,
    };

    return new GrantTypeParams(config, baseParams, params);
  }

  constructor(config, baseParams, params) {
    this.#config = { ...config };
    this.#params = { ...params };
    this.#baseParams = { ...baseParams };
  }

  toObject() {
    const scopeParams = getScopeParam(this.#params.scope, this.#config.options.scopeSeparator);

    const clientCreds = {};
    if (this.#config.options.includeClientCredsInTokenRequests) {
      clientCreds.client_id = this.#config.client.id;
      clientCreds.client_secret = this.#config.client.secret;
    }

    return Object.assign(this.#baseParams, this.#params, scopeParams, clientCreds);
  }
};
