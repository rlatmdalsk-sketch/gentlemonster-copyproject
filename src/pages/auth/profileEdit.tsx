import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore.ts";
import { twMerge } from "tailwind-merge";
import Input from "../components/input.tsx";
import type {UpdateProfileDto} from "../../types/user.ts";
import {updateProfile} from "../../api/auth.api.ts";

function ProfileEdit() {
    const navigate = useNavigate();
    const { user, login, token } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdateProfileDto>({
        defaultValues: {
            name: user?.name || "",
            phone: user?.phone || "",
        },
    });

    const onSubmit = async (data: UpdateProfileDto) => {
        try {
            const updatedUser = await updateProfile(data);

            if (updatedUser && token) {
                login(updatedUser, token);
                alert("프로필이 성공적으로 수정되었습니다.");
                navigate("/myaccount");
            }
        } catch (error: any) {
            alert(error.response?.data?.message || "수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen pt-20 px-4">
            <h2 className="text-2xl font-bold mb-10">프로필 편집</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600 ml-1">이름</label>
                    <Input
                        {...register("name", { required: "이름은 필수입니다." })}
                        placeholder="이름을 입력하세요"
                        className={twMerge(errors.name && "border-red-500")}
                    />
                    {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600 ml-1">휴대폰 번호</label>
                    <Input
                        {...register("phone", {
                            required: "휴대폰 번호는 필수입니다.",
                            pattern: {
                                value: /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/,
                                message: "올바른 번호 형식이 아닙니다."
                            }
                        })}
                        placeholder="휴대폰 번호를 입력하세요"
                        className={twMerge(errors.phone && "border-red-500")}
                    />
                    {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 h-12 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 h-12 bg-black text-white rounded-md font-bold hover:bg-zinc-800 disabled:bg-gray-400 cursor-pointer"
                    >
                        {isSubmitting ? "저장 중..." : "수정 완료"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProfileEdit;