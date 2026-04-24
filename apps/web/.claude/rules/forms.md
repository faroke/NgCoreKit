# Forms — Angular Signal Forms

Angular Signal Forms (`@angular/forms/signals`) is the **only** approved form library.

**NEVER use:**
- `FormsModule` / `ngModel`
- `ReactiveFormsModule` / `FormGroup` / `FormControl`
- Any third-party form library

## Basic Form Pattern

```typescript
import { Component, signal } from '@angular/core';
import { FormField, form, required, email, minLength } from '@angular/forms/signals';

@Component({
  standalone: true,
  imports: [FormField],
  ...
})
export class LoginComponent {
  protected readonly model = signal({ email: '', password: '' });

  protected readonly loginForm = form(this.model, (s) => {
    required(s.email);
    email(s.email, { message: 'Enter a valid email address.' });
    required(s.password);
    minLength(s.password, 8);
  });

  async onSubmit() {
    if (this.loginForm.invalid()) return;
    // loginForm.value() contains the validated values
    await this.authService.login(this.loginForm.value());
  }
}
```

## Template

```html
<form (ngSubmit)="onSubmit()">
  <div>
    <input [formField]="loginForm.email" type="email" placeholder="Email" />
    @if (loginForm.email.touched() && loginForm.email.errors()?.['required']) {
      <p class="text-xs text-destructive mt-1">This field is required.</p>
    }
    @if (loginForm.email.touched() && loginForm.email.errors()?.['email']) {
      <p class="text-xs text-destructive mt-1">Enter a valid email address.</p>
    }
  </div>

  <div>
    <input [formField]="loginForm.password" type="password" placeholder="Password" />
    @if (loginForm.password.touched() && loginForm.password.errors()?.['required']) {
      <p class="text-xs text-destructive mt-1">This field is required.</p>
    }
  </div>

  <button type="submit" [disabled]="loginForm.invalid() || isLoading()">
    Sign In
  </button>
</form>
```

## Rules

1. **Gate errors on `.touched()`** — never show errors on initial load
2. **Optional fields**: add validators WITHOUT `required()` — empty string passes
3. **Pre-filled fields**: initialize model in `ngOnInit()` via `model.update()`
4. **Derived fields**: use `effect()` in `constructor()` to sync derived values
5. **Disable submit**: use `[disabled]="loginForm.invalid()"` — never check model directly

## Pre-filling a Form

```typescript
ngOnInit(): void {
  // Pre-fill after getting data
  this.model.update((m) => ({
    ...m,
    email: this.user().email,
    name: this.user().name,
  }));
}
```

## Derived Field (auto-computed)

```typescript
constructor() {
  effect(() => {
    const firstName = this.model().firstName;
    const lastName = this.model().lastName;
    this.model.update((m) => ({ ...m, displayName: `${firstName} ${lastName}` }));
  });
}
```

## Available Validators

```typescript
import { required, email, minLength, maxLength, pattern, min, max } from '@angular/forms/signals';

form(model, (s) => {
  required(s.name);
  minLength(s.name, 3);
  maxLength(s.name, 50);
  email(s.email);
  pattern(s.phone, /^\d{10}$/);
  min(s.age, 18);
  max(s.age, 120);
});
```
