-   [Authorize](#Authorize)
    -   [SuperAuthorizeModule](#SuperAuthorizeModule)
    -   [@Resource()](<#@Resource()>)
        -   [@SuperAuthorize()](<#@SuperAuthorize(`method`)>)

## Authorize

### SuperAuthorizeModule

```ts
SuperAuthorizeModule.forRoot({
    paths: ['admin', 'front'],
    jwt: {
        secret: appSettings.jwt.secret,
        issuer: appSettings.jwt.issuer,
        expiresIn: appSettings.jwt.expireIn,
    },
}),
```

-   `paths`: Create permission for controller admin and front. In the future,
    will refactor.

### @Resource()

-   Use in controller to system create permission and authentication.

#### @SuperAuthorize(`method`)

-   Use function in class controller, `method` is GET, POST, PUT, DELETE.
    node_modules
