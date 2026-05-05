import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStaff, updateStaffStatus, inviteStaff } from '../api/staff';

export const useStaff = () => {
  const queryClient = useQueryClient();

  const staffQuery = useQuery({
    queryKey: ['staff'],
    queryFn: getStaff,
  });

  const toggleLockMutation = useMutation({
    mutationFn: ({ id, isLocked }: { id: string; isLocked: boolean }) => 
      updateStaffStatus(id, isLocked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });

  const inviteMutation = useMutation({
    mutationFn: ({ email, role }: { email: string; role: string }) => 
      inviteStaff(email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });

  return {
    staff: staffQuery.data ?? [],
    isLoading: staffQuery.isLoading,
    isError: staffQuery.isError,
    toggleLock: toggleLockMutation.mutate,
    isToggling: toggleLockMutation.isPending,
    inviteStaff: inviteMutation.mutate,
    isInviting: inviteMutation.isPending,
  };
};
