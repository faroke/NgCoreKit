import { Injectable, inject } from "@angular/core";
import { ApiService } from "./api.service";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  role: string | null;
  createdAt: string;
};

type UpdateProfileDto = { name?: string };
type ChangePasswordDto = { currentPassword: string; newPassword: string };
type ChangeEmailDto = { newEmail: string; password: string };
type DeleteAccountDto = { password: string };

@Injectable({ providedIn: "root" })
export class AccountService {
  private api = inject(ApiService);

  getProfile() {
    return this.api.get<{ data: UserProfile }>("/account/me");
  }

  updateProfile(dto: UpdateProfileDto) {
    return this.api.patch<{ data: UserProfile }>("/account/profile", dto);
  }

  changePassword(dto: ChangePasswordDto) {
    return this.api.patch<{ message: string }>("/account/change-password", dto);
  }

  changeEmail(dto: ChangeEmailDto) {
    return this.api.patch<{ data: UserProfile }>("/account/change-email", dto);
  }

  deleteAccount(dto: DeleteAccountDto) {
    return this.api.deleteWithBody<void>("/account", dto);
  }
}
