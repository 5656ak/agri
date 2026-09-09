import { User, BusinessProfile } from '../types';

const USERS_STORAGE_KEY = 'nexa_auth_users';
const SESSION_STORAGE_KEY = 'nexa_active_session';
const BUSINESS_PROFILE_PREFIX = 'nexa_business_profile_';

interface StoredUser extends User {
  passwordHash: string; // Base64 encoded for simulation
}

// Helper to hash password
function hashPassword(password: string): string {
  try {
    return btoa(password);
  } catch {
    return password;
  }
}

export function getAllUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession(user: User | null): void {
  if (user) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function calculatePasswordStrength(password: string): {
  score: number; // 0 to 4
  label: 'Too Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
} {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (!password) {
    return { score: 0, label: 'Too Weak', color: '#EF4444', hasMinLength: false, hasUppercase: false, hasNumber: false, hasSpecial: false };
  }

  let score = 0;
  if (hasMinLength) score += 1;
  if (hasUppercase) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecial) score += 1;

  let label: 'Too Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' = 'Weak';
  let color = '#EF4444';

  switch (score) {
    case 0:
    case 1:
      label = 'Weak';
      color = '#EF4444';
      break;
    case 2:
      label = 'Fair';
      color = '#F59E0B';
      break;
    case 3:
      label = 'Good';
      color = '#3B82F6';
      break;
    case 4:
      label = 'Strong';
      color = '#10B981';
      break;
    default:
      label = 'Weak';
      color = '#EF4444';
  }

  return {
    score,
    label,
    color,
    hasMinLength,
    hasUppercase,
    hasNumber,
    hasSpecial
  };
}

export async function registerUser(params: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user?: User; error?: string }> {
  const { name, email, password } = params;

  if (!name.trim()) {
    return { error: 'Full name is required.' };
  }

  if (!validateEmail(email)) {
    return { error: 'Please enter a valid business email address.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long.' };
  }

  const users = getAllUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return { error: 'An account with this email address already exists. Please sign in.' };
  }

  const newUser: StoredUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    hasCompletedOnboarding: false,
    createdAt: new Date().toISOString(),
    passwordHash: hashPassword(password),
  };

  users.push(newUser);
  saveUsers(users);

  // Strip password hash before returning
  const { passwordHash, ...safeUser } = newUser;
  setSession(safeUser);

  return { user: safeUser };
}

export async function loginUser(params: {
  email: string;
  password: string;
}): Promise<{ user?: User; error?: string }> {
  const { email, password } = params;

  if (!validateEmail(email)) {
    return { error: 'Please enter a valid email address.' };
  }

  if (!password) {
    return { error: 'Password is required.' };
  }

  const users = getAllUsers();
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!found) {
    return { error: 'No account found with this email. Please create an account.' };
  }

  if (found.passwordHash !== hashPassword(password)) {
    return { error: 'Incorrect password. Please try again or reset your password.' };
  }

  const { passwordHash, ...safeUser } = found;
  setSession(safeUser);
  return { user: safeUser };
}

export async function loginWithGoogle(): Promise<{ user: User }> {
  const googleUser: StoredUser = {
    id: `usr_google_${Date.now()}`,
    name: 'Sarah Connor',
    email: 'sarah.connor@apexenterprise.com',
    businessName: 'Apex Enterprise Global',
    hasCompletedOnboarding: false,
    createdAt: new Date().toISOString(),
    passwordHash: 'social_auth_token',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  };

  const users = getAllUsers();
  const existingIdx = users.findIndex(u => u.email === googleUser.email);
  if (existingIdx !== -1) {
    const existing = users[existingIdx];
    const { passwordHash, ...safe } = existing;
    setSession(safe);
    return { user: safe };
  } else {
    users.push(googleUser);
    saveUsers(users);
    const { passwordHash, ...safe } = googleUser;
    setSession(safe);
    return { user: safe };
  }
}

export function logoutUser(): void {
  setSession(null);
}

export function resetPasswordRequest(email: string): { success: boolean; message: string } {
  if (!validateEmail(email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  return {
    success: true,
    message: `Password reset link has been dispatched to ${email}. Check your inbox.`
  };
}

export function saveUserBusinessProfile(userId: string, profile: BusinessProfile): void {
  localStorage.setItem(`${BUSINESS_PROFILE_PREFIX}${userId}`, JSON.stringify(profile));

  // Update current user record in session & users list
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    currentUser.businessName = profile.businessName;
    currentUser.hasCompletedOnboarding = true;
    setSession(currentUser);

    const users = getAllUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].businessName = profile.businessName;
      users[idx].hasCompletedOnboarding = true;
      saveUsers(users);
    }
  }
}

export function getUserBusinessProfile(userId: string): BusinessProfile | null {
  try {
    const raw = localStorage.getItem(`${BUSINESS_PROFILE_PREFIX}${userId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
