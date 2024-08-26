const getHanoiSolutions = (nDiscs) => {
  const solutions = [];

  const hanoi = (n, origin, destiny, aux) => {
    if (n == 1) {
      solutions.push({ disc: n, origin, destiny });
      return;
    }

    hanoi(n - 1, origin, aux, destiny);

    solutions.push({ disc: n, origin, destiny });

    hanoi(n - 1, aux, destiny, origin);
  };

  hanoi(nDiscs, 0, 1, 2);

  return solutions;
};

export { getHanoiSolutions };
