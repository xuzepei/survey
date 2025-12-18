class Calculator {
    add(a, b) {
        return a + b;
    }
    subtract(a, b) {
        return a - b;
    }
    multiply(a, b) {
        return a * b;
    }
    divide(a, b) {
        return a / b;
    }

    factorial(a) {
        if (a == 0) {
            return 1;
        }
        return a * this.factorial(a - 1);
    }
}