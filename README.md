# fastify-aws-jwt-verify
Fastify plugin wrapper around [aws-jwt-verify](https://github.com/awslabs/aws-jwt-verify) for JWT authentication/authorization with AWS Cognito

The options provided to the plugin registration are passed directly to `CognitoJwtVerifier.create` with helpers for ease of reuse.

## Install
```
npm i fastify-aws-jwt-verify
```

## Usage
Register as a plugin, providing the following options:

### `tokenProvider`
Either use a built-in method for extracting the JWT token from a request or provide your own

#### Built-in method(~~s~~)
- **`Bearer`**: Follow the Bearer Authorization scheme, where the token is provided via the `Authorization` header with value `Bearer <TOKEN>`

#### Custom token provider
Accept the `FastifyRequest` object and return the extracted `string` token, e.g.

```typescript
await fastify.register(FastifyAwsJwtVerify, {
  tokenProvider: req => {
    if ('X-Auth-Token' in req.headers) {
      return req.headers['X-Auth-Token']
    } else {
      throw new Unauthorized("Missing 'X-Auth-Token' header")
    }
  },
  userPoolId: 'user-pool-id'
})
```

### User pool options
Plugin configuration supports scenarios for both a single user pool or multiple potential user pools.

#### Single user pool
For a single user pool, set verifier fields in the top-level plugin configuration object, e.g.

```typescript
await fastify.register(FastifyAwsJwtVerify, {
  clientId: 'app-client-id',
  tokenProvider: 'Bearer',
  tokenUse: 'access',
  userPoolId: 'user-pool-id'
})
```

For complete set of options, see the [aws-jwt-verify package documentation](https://github.com/awslabs/aws-jwt-verify/tree/main?tab=readme-ov-file#cognitojwtverifier-verify-parameters)

#### Multiple user pools
For multiple user pools, set verifier fields in the `pools` field of the plugin configuration, e.g.

```typescript
await fastify.register(FastifyAwsJwtVerify, {
  pools: [
    {
      clientId: 'app-client-id-1',
      tokenUse: 'access',
      userPoolId: 'user-pool-1'
    },
    {
      clientId: 'app-client-id-2',
      tokenUse: 'access',
      userPoolId: 'user-pool-2'
    }
  ],
  tokenProvider: 'Bearer'
})
```

For complete set of options, see the [aws-jwt-verify package documentation](https://github.com/awslabs/aws-jwt-verify/tree/main?tab=readme-ov-file#cognitojwtverifier-verify-parameters)

### Request handlers
Registering the plugin on its own does not require authentication/authorization on any route. Three decorators are provided to simplify attaching handlers.

#### `auth.require(options?: FastifyAwsJwtVerifyOptions)`
If no options provided, requires authorization based on the options provided at plugin registration time. This is the simplest usage.
```typescript
fastify.addHook('onRequest', fastify.auth.require())
```
If any option is provided, it overrides the corresponding option in the base plugin configuration options. (*Note: Providing the `pools` field here overrides the entire `pools` field in the base options.*)
```typescript
fastify.addHook('onRequest', fastify.auth.require({
  groups: [ 'Administrators', 'Moderators' ]
}))
```

#### `auth.client(...clientIds: string[])`
Specify allowed client IDs in place of the base configuration options, e.g.
```typescript
fastify.addHook('onRequest', fastify.auth.client( 'app-client-1', 'app-client-2' ))
```
This is semantically equivalent to
```typescript
fastify.addHook('onRequest', fastify.auth.require({
  clientId: [ 'app-client-1', 'app-client-2' ]
}))
```

#### `auth.groups(...groups: string[])`
Specify allowed groups in place of the base configuration options, e.g.
```typescript
fastify.addHook('onRequest', fastify.auth.groups( 'Administrators', 'Moderators' ))
```
This is semantically equivalent to
```typescript
fastify.addHook('onRequest', fastify.auth.require({
  groups: [ 'Administrators', 'Moderators' ]
}))
```

### User payload
Upon successful JWT verification, the request is decorated with the decoded user payload in the `user` field.
```typescript
fastify.post('/item', {
  onRequest: fastify.auth.groups('Administrators')
}, req => {
  fastify.log.info(`User: ${req.user}`)
  // Add item
})
```

## Example
```typescript
const fastify = Fastify()

await fastify.register(fp(fastifyAwsJwtVerifyPlugin), {
    clientId: 'app-client-1',
    tokenProvider: 'Bearer',
    tokenUse: 'access',
    userPoolId: 'user-pool-1'
})

// No authorization required
await fastify.get('/', req => { /** Handle request **/ })

// Require authorization based on registration options
await fastify.get('/account', {
  onRequest: fastify.auth.require()
}, req => { /** Handle request **/ })

// Administrators group membership required
await fastify.post('/item', {
  onRequest: fastify.auth.groups('Administrators')
}, req => { /** Handle request **/ })
```

## License
Licensed under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
