---
title: Making the Auth0 SPA SDK unit testable with Angular
date: 2019-10-31
description: The Auth0 Angular Quick Start hides the client behind a promise, which makes it awkward to mock. An InjectionToken turns it into a constructor dependency you can stub and spy on.
tags:
  - angular
  - auth0
  - unit-testing
---

[Auth0](https://auth0.com/), the authentication service and identity provider has a new [SDK for Single Page Applications](https://auth0.com/docs/libraries/auth0-spa-js) (SPAs) that works well with Angular. Their dashboard has an Angular Quick Start, and in it they provide a tailored wrapper class for Angular to work with their SDK. When you extend this class you may run into the issue that you can't easily mock the `Auth0Client` dependency. Read on to find out how to do this.

<!-- more -->

Part of the provided `AuthService` class looks like below.

```typescript
@Injectable({providedIn: 'root'})
export class AuthService {

  // Create an observable of Auth0 instance of client
  auth0Client$ = (from(
    createAuth0Client({
      domain: "example.auth0.com",
      client_id: "ABC123abc123abc123ABC",
      redirect_uri: `${window.location.origin}`
    })
  ) as Observable<Auth0Client>).pipe(
    shareReplay(1), // Every sub receives the same shared value
    catchError(err => throwError(err))
  );
```

The problem lies with the `createAuth0Client` function that is imported from the SDK. It provides access to the client object via a promise. Angular heavily depends on RXJS however, and to transform this into an observable, the `from` helper function is used. Other properties in the class are then chained to this observable to provide the authentication functionality.

For unit testing this is a dilemma, as it poses an external dependency that cannot be accessed. It is similar to directly using the browser's `document` object versus an injected `Document` reference in your Angular code. Instead, when the class is created, this external dependency should be injectable via the constructor so that the object can be mocked and spied upon.

## Injecting the Auth0Client observable

Since the `Auth0Client` is loaded asynchronously with a promise that is wrapped as an observable, it may seem impossible to create a dependency in the constructor to `Observable<Auth0Client>`. However, this is possible in Angular through the use of an `InjectionToken`.

As of Angular 6, the `InjectionToken` is now tree shakable and can leverage a factory function. That makes it easy to define our injectable token:

```typescript
export const AUTH0_CLIENT =
  new InjectionToken<Observable<Auth0Client>>('auth0Client$', {
    providedIn: 'root',
    factory: () => from(
      createAuth0Client({
        domain: environment.auth0.domain,
        client_id: environment.auth0.clientId,
        audience: environment.auth0.audience,
        redirect_uri: REDIRECT_URI
      })
    ).pipe(
      shareReplay(1), // Every sub receives the same shared value
      catchError(err => throwError(err))
    )
  });
```

Next, this token can now be injected into the constructor of the `AuthService` class:

```typescript
constructor(
  // Use an injection token to get an observable instance
  // of the Auth0 client.
  @Inject(AUTH0_CLIENT)
  private auth0Client$: Observable<Auth0Client>,
```

Because the token was marked with `provideIn`, and referenced in the injectable `AuthService`, it is discovered during build and included in the compilation. There is no need to expose it with a provider in a module.

## Mocking the Auth0Client in unit tests

With the introduction of TypeScript's `Partial` interface, it became a whole lot easier to mock type-safe partial implementations. With it we can mock for instance only one class function. We then can wrap that into an observable with the `of` helper function, and inject that into the `AuthService`.

```typescript
const clientStub = of<Partial<Auth0Client>>({
  getTokenSilently: async () => null
});

beforeEach(() => {
  service = new AuthService(
    <Observable<Auth0Client>>clientStub,
    // etc...
  );
});
```

The above code mocks the result of the `getTokenSilently` function, to return a promise with an undefined token.

With this method it is also easy to spy on the mocks as well:

```typescript
const clientStub = <Partial<Auth0Client>>{
  getTokenSilently: async () => null
};
const clientStub$ = of(clientStub);

beforeEach(() => {
  spyOn(clientStub, 'getTokenSilently').and.callThrough();
  service = new AuthService(
    <Observable<Auth0Client>>clientStub$,
    // etc...
  );
});

it('should handle custom initialization', (done: DoneFn) => {
  service.init().subscribe(
    () => {
      expect(clientStub.getTokenSilently).toHaveBeenCalled();
      done();
    },
    error => fail(`Unexpected error: ${error}`)
  );
});
```

Hopefully this gave you insight how to extend the `AuthService` class to make it possible to unit test it better.

Thanks for reading!
