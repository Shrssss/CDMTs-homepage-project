import { createMember, getMemberDetail, loginMember, logoutMember, MemberCreateRequest, MemberLoginRequest, MemberUpdateRequest, searchMember, updateMember, updatePassword, UpdatePasswordRequest } from "@/lib/features/member";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSearchMember = ({
  grades,
  name,
  page,
  positions,
}: {
  name: string | null;
  grades: number[];
  positions: string[];
  page: number | null;
}) => {
  return useQuery({
    queryFn: async () => {
      return await searchMember({ grades, name, page, positions });
    },
    queryKey: ["searchMember", grades, name, page, positions],
  });
};

export const useMemberDetail = ({ id }: { id: number }) => {
  return useQuery({
    queryFn: async () => {
      return await getMemberDetail({
        id,
      });
    },
    queryKey: ["memberDetail", id],
  });
};

export const useCreateMemberMutation=(request:MemberCreateRequest)=>{
  return useMutation({
    mutationFn:async()=>{
      return await createMember(request)
    }
  })
}

export const useLoginMemberMutation=(request:MemberLoginRequest)=>{
  return useMutation({
    mutationFn:async()=>{
      return await loginMember(request)
    }
  })
}

export const useLogoutMemberMutation=()=>{
  return useMutation({
    mutationFn:async()=>{
      await logoutMember()
    }
  })
}

export const useUpdateMemberMutation=(request:MemberUpdateRequest)=>{
  return useMutation({
    mutationFn:async()=>{
      await updateMember(request)
    }
  })
}

export const useUpdatePasswordMutatioin=(request:UpdatePasswordRequest)=>{
  return useMutation({
    mutationFn:async()=>{
      return await updatePassword(request)
    }
  })
}