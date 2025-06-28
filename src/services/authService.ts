import { 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { jwtDecode } from 'jwt-decode';
import { auth } from './firebase'; // Import the initialized auth instance
import { User } from '../types';

interface DecodedToken {
  role?: 'admin' | 'user';
  // Add other potential claims here
}

/**
 * Maps a Firebase User object and their token to our application's User type.
 */
const mapFirebaseUserToAppUser = (firebaseUser: FirebaseUser, token: string): User => {
  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || 'No email',
      name: firebaseUser.displayName || 'No name',
      // Use the role from the token, or default to the standard 'user' role.
      role: decodedToken.role || 'user', 
      createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
      updatedAt: new Date(firebaseUser.metadata.lastSignInTime || Date.now()),
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    // Fallback for an invalid token
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || 'No email',
      name: firebaseUser.displayName || 'No name',
      role: 'user', // Safest default role
      createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
      updatedAt: new Date(firebaseUser.metadata.lastSignInTime || Date.now()),
    };
  }
};

export const authService = {
  /**
   * Signs in a user. The persistence is set globally at app initialization
   * to 'session', meaning the user will need to log in again after the
   * browser tab is closed.
   */
  async login(credentials: { email: string; password: string }) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    
    const token = await userCredential.user.getIdToken();
    const appUser = mapFirebaseUserToAppUser(userCredential.user, token);

    return {
      success: true,
      user: appUser,
      token: token,
      message: 'Login successful',
    };
  },

  // Sign out the current user
  async logout() {
    await signOut(auth);
    return {
      success: true,
      message: 'Logout successful',
    };
  },

  // Listen for authentication state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onFirebaseAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        const appUser = mapFirebaseUserToAppUser(firebaseUser, token);
        callback(appUser); 
      } else {
        // User is signed out
        callback(null);
      }
    });
  },
}; 