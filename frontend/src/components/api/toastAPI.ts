import { toast, type ToastOptions } from "vue3-toastify";

function successNotice(words: string) {
    toast(words, {
        theme: "auto",
        type: "success",
        transition: "slide",
        dangerouslyHTMLString: true,
    });
}

function warnNotice(words: string) {
    toast(words, {
        theme: "auto",
        type: "warning",
        transition: "slide",
        dangerouslyHTMLString: true,
    });
}

function errorNotice(words: string) {
    toast(words, {
        theme: "auto",
        type: "error",
        transition: "slide",
        dangerouslyHTMLString: true,
    });
}

export default {
    successNotice,
    warnNotice,
    errorNotice,
};
