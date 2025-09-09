export const required = (v) => {
    return !!v || 'Tidak Boleh Kosong'
}

export const validEmail = (v) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    return !v || emailRegex.test(v) || 'E-mail Tidak Valid';
}

export const validPhoneNumber = (v) => {
    const phoneRegex = /^\+?(\d{7,15})$/;
  
    return !v || phoneRegex.test(v) || 'Nomor Telepon Tidak Valid';
};

export const maxLength = (max) => (v) => {
    return !v || v.length <= max || `Tidak Boleh Lebih Dari ${max} Karakter`
}

export const minLength = (min) => (v) => {
    return !v || v.length >= min || `Minimal ${min} Karakter`
}

export const unique = (usedItems, message) => (v) => {
    return !usedItems.includes(v) || message
}

export const match = (valueToMatch, message) => (v) => {
    return !v || v === valueToMatch || message
}

export const correctValue = (isCorrect, message) => (v) => {
    return !v || isCorrect || message
}

export const maxSize = (size, message = null) => (v) => {
    return !v || !v.length || v[0].size < size || message ? message : `File Tidak Boleh Lebih Dari ${size / 1000000} MB`
}