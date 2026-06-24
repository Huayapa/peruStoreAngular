import { FormControl, FormGroup } from '@angular/forms';
import { crossPasswordCustomValidation, PasswordStateMatcher } from './cross-password.validator';

describe('crossPasswordCustomValidation', () => {
  it('should return object with true if repeatpassword is invalid', () => {
    const form = new FormGroup({
      password: new FormControl('12345'),
      repeatpassword: new FormControl('123456789'),
    });

    expect(crossPasswordCustomValidation(form)).toEqual({
      customValidationPassword: true,
    });
  });
  it('should return null if repeatpassword is valid', () => {
    const form = new FormGroup({
      password: new FormControl('123456789'),
      repeatpassword: new FormControl('123456789'),
    });
    expect(crossPasswordCustomValidation(form)).toEqual(null);
  });
});

describe('PasswordStateMatcher', () => {
  let matcher: PasswordStateMatcher;
  beforeEach(() => {
    matcher = new PasswordStateMatcher();
  });
  it('should return false when control is null', () => {
    expect(matcher.isErrorState(null)).toBe(false);
  });
  it('should return false when control has no parent', () => {
    expect(matcher.isErrorState(new FormControl())).toBe(false);
  });
  it('should return true when has parent error', () => {
    const form = new FormGroup(
      {
        password: new FormControl('12345'),
        repeatpassword: new FormControl('123456789'),
      },
      { validators: crossPasswordCustomValidation },
    );
    expect(matcher.isErrorState(form.get('password'))).toBe(true);
    expect(matcher.isErrorState(form.get('repeatpassword'))).toBe(true);
  });
  it('should return false when has not parent error', () => {
    const form = new FormGroup(
      {
        password: new FormControl('123456789'),
        repeatpassword: new FormControl('123456789'),
      },
      { validators: crossPasswordCustomValidation },
    );
    expect(matcher.isErrorState(form.get('password'))).toBe(false);
    expect(matcher.isErrorState(form.get('repeatpassword'))).toBe(false);
  });
});
