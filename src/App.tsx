import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text } from 'react-native';
import { Button, Title } from 'react-native-paper';
import questions from './questions.json';

type Question = {
  question: string;
  options: string[];
  answer: string;
};

export default function QuizApp() {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [highlightedOption, setHighlightedOption] = useState<string | null>(null);

  // Função para embaralhar um array
  const shuffleArray = <T,>(array: T[]): T[] => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  useEffect(() => {
    const shuffled = shuffleArray(questions)
      .slice(0, 10)
      .map((question) => ({
        ...question,
        options: shuffleArray(question.options),
      }));
    setShuffledQuestions(shuffled);
  }, []);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleOptionPress = (option: string) => {
    setSelectedOption(option);
    setHighlightedOption(option);

    // Verificar se a resposta está correta
    if (currentQuestion && option === currentQuestion.answer) {
      setCorrectCount((prev) => prev + 1);
    }

    // Esperar 1 segundo antes de avançar para a próxima pergunta
    setTimeout(() => {
      setSelectedOption(null);
      setHighlightedOption(null);

      if (currentQuestionIndex + 1 < shuffledQuestions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setGameOver(true);
      }
    }, 1000);
  };

  const resetGame = () => {
    const shuffled = shuffleArray(questions)
      .slice(0, 10)
      .map((question) => ({
        ...question,
        options: shuffleArray(question.options),
      }));
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setSelectedOption(null);
    setHighlightedOption(null);
    setGameOver(false);
  };

  const calculateScore = () => {
    return Math.round((correctCount / shuffledQuestions.length) * 100);
  };

  if (!currentQuestion && !gameOver) return null;

  return (
    <ImageBackground
      source={{
        uri: 'https://cdn.pixabay.com/photo/2023/02/01/05/52/cosmos-7759620_1280.jpg',
      }}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.container}>
        {gameOver ? (
          <View style={styles.resultContainer}>
            <Title style={styles.title}>SPACE QUIZ</Title>
            <Text style={styles.subtitle}>Perguntas de Outro Mundo!</Text>
            <View style={styles.resultBox}>
              {correctCount === 10 ? (
                <Text style={styles.congratulations}>
                  Parabéns! Você acertou todas as perguntas!
                </Text>
              ) : (
                <>
                  <Text style={styles.resultText}>Você acertou</Text>
                  <Text style={styles.resultPercentage}>
                    {calculateScore()}%
                  </Text>
                </>
              )}
              <Button
                mode="contained"
                onPress={resetGame}
                style={styles.retryButton}
                labelStyle={styles.retryButtonText}
              >
                Reiniciar
              </Button>
            </View>
          </View>
        ) : (
          <>
            <Title style={styles.title}>SPACE QUIZ</Title>
            <Text style={styles.subtitle}>Perguntas de Outro Mundo!</Text>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>
                {currentQuestion?.question}
              </Text>
            </View>
            <View style={styles.optionsContainer}>
              {currentQuestion?.options.map((option, index) => (
                <Button
                  key={index}
                  mode="contained"
                  onPress={() => handleOptionPress(option)}
                  style={[
                    styles.optionButton,
                    selectedOption &&
                      option === currentQuestion.answer &&
                      styles.correctOption,
                    selectedOption &&
                      option === highlightedOption &&
                      option !== currentQuestion.answer &&
                      styles.incorrectOption,
                  ]}
                  labelStyle={styles.optionText}
                  disabled={selectedOption !== null}
                >
                  {option}
                </Button>
              ))}
            </View>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionContainer: {
    backgroundColor: 'purple',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  questionText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    marginBottom: 10,
    backgroundColor: 'green',
    borderRadius: 10,
  },
  correctOption: {
    backgroundColor: 'darkgreen',
  },
  incorrectOption: {
    backgroundColor: 'red',
  },
  optionText: {
    fontSize: 16,
    color: 'white',
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultBox: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  resultText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultPercentage: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: 'green',
    borderRadius: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  congratulations: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'gold',
    textAlign: 'center',
    marginBottom: 20,
  },
});
