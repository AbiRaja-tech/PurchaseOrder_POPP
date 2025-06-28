import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { setUser } from '../store/slices/authSlice';
import { authService } from '../services/authService';

/**
 * A custom hook to manage authentication state and actions.
 * It provides the current user, loading state, and a logout function.
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Select authentication state from the Redux store
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  // Define the logout function
  const logoutUser = async () => {
    await authService.logout();
    dispatch(setUser(null)); // Clear the user from Redux state
    navigate('/login', { replace: true });
  };

  return { user, loading, error, logoutUser };
}; 