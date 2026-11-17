
import BackPhoto from "@/../images/arrow-back-ios-rounded.png";

export default function BackButton({ back }) {
    return (
        <button
            type="button"
            onClick={back}
            className="inline-flex min-h-[36px] max-w-full shrink-0 cursor-pointer items-center justify-start gap-1 whitespace-nowrap text-theme-muted sm:min-h-[40px]"
        >
            <img
                src={BackPhoto}
                alt=""
                className="!h-[15px] !w-[15px] !max-w-[15px] shrink-0 object-contain"
            />

            <span className="text-[13px] sm:text-[15px]">
                Wróć
            </span>
        </button>
    );
}
