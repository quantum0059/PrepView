'use client';
import {useTransition} from "react";
import {useRouter} from "next/navigation";
import { retakeInterview } from "@/lib/actions/general.action";
import { Button } from "./ui/button";

type Props = {
    interviewId: string;
    userId: string;
    className?: string;
};

export default function RetakeInterviewButton({
    interviewId,
    userId,
    className,

}: Props){
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const onRetake = () => {
        startTransition(async () => {
            const res = await retakeInterview({ interviewId, userId});

            if(res?.success){
                router.push(`/interview/${interviewId}`);
                router.refresh();
            }else{
                console.error("Failed to retake interview");
            }
        })
    }

    return (
        <Button
          type="button"
          onClick={onRetake}
          disabled={isPending}
          className={className ?? "btn-primary flex-1"}
        >
            <span className="text-sm font-semibold text-black text-center">
               {isPending ? "Retaking..." : "Retake Interview"}
            </span>
        </Button>
    );
}