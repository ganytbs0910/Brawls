export const characterData: Character[] = Array.from({ length: 85 }, (_, index) => ({
  id: index + 1,
  name: `name_${index + 1}`,
  compatibilities: Object.fromEntries(
    Array.from({ length: 85 }, (_, i) => {
      if (i === index) return [i + 1, 10]; // 自分自身との相性は10
      return [i + 1, Math.floor(Math.random() * 10) + 1]; // 他のキャラクターとの相性は1-10のランダム
    })
  )
}));