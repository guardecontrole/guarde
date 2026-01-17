// Funções auxiliares

const getFriendlyAuthError = (code) => {
    switch (code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'E-mail ou senha inválidos.';
        case 'auth/email-already-in-use':
            return 'Este e-mail já está em uso.';
        case 'auth/weak-password':
            return 'A senha deve ter pelo menos 6 caracteres.';
        case 'auth/invalid-email':
            return 'O formato do e-mail é inválido.';
        default:
            return 'Ocorreu um erro. Por favor, tente novamente.';
    }
};

// Exporta para uso global
window.helpers = {
    getFriendlyAuthError
};
