package main

import (
	"fmt"
	"io/ioutil"
	"math"
	"os"
	"sort"
	"strconv"
	"strings"
)

func main() {
	files := []string{"a_example.txt", "b_read_on.txt", "c_incunabula.txt", "d_tough_choices.txt", "e_so_many_books.txt", "f_libraries_of_the_world.txt"}
	doAlgorithm(getContextFromFile(files[2]))

	// idea for d: sort by amount of books per library and just send all books from top library
}


func doAlgorithm(context Context) {
	//if context.outputFilename == "d_tough_choices" {
	//	sort.Slice(context.libraries, func(i, j int) bool {
	//		return context.libraries[i].bookAmount > context.libraries[j].bookAmount
	//	})
	//
	//	for i, library := range context.libraries {
	//		//fmt.Println(len(library.bookIds))
	//
	//		context.libraries[i].usedBookIds = library.bookIds
	//		//fmt.Println(len(library.usedBookIds))
	//	}
	//
	//	writeOutput(context.outputFilename, context.libraries)
	//	return
	//}

	T := 0

	isBookIdUsed := make([]bool, context.totalBooks)
	isLibraryIdUsed := make([]bool, context.totalLibraries)

	usedLibraries := make([]Library, 0, context.totalLibraries)

	for T < context.deadline {
		max := 0
		var maxLibrary Library
		foundMaxLibrary := false

		for i, library := range context.libraries {
			if isLibraryIdUsed[i] {
				continue
			}

			scannableDays := context.deadline - library.signupTime - T
			if scannableDays <= 0 {
				continue
			}

			scannableBooksAmount := scannableDays*library.scansPerDay
			tempBookIds := make([]int, 0, library.bookAmount)
			for _, bookId := range library.bookIds {
				if !isBookIdUsed[bookId] {
					tempBookIds = append(tempBookIds, bookId)
				}
			}

			//sort.Slice(tempBookIds, func(i, j int) bool {
			//	return context.bookScores[tempBookIds[i]] > context.bookScores[tempBookIds[j]]
			//})

			library.usedBookIds = tempBookIds[0:int(math.Min(float64(len(tempBookIds)), float64(scannableBooksAmount)))]

			//
			tempT := T + library.signupTime
			tempMax := 0
			isLibraryIdUsed[library.id] = true
			for _, bookId := range library.usedBookIds {
				isBookIdUsed[bookId] = true
			}

			//c := make(chan int)
			//
			//////
			//threads := 8
			//for k := 0; k < threads; k++ {
			//	start := int(math.Ceil(float64(k)/float64(threads)*float64(context.totalLibraries)))
			//	end := int(math.Floor(float64(k+1)/float64(threads)*float64(context.totalLibraries)))
			//	if end == context.totalLibraries {
			//		end -= 1
			//	}
			//	go func() {
			//		for i := start; i <= end; i++ {
			//			innerLibrary := context.libraries[i]
			//
			//			if isLibraryIdUsed[innerLibrary.id] {
			//				c <- 0
			//				continue
			//			}
			//
			//			innerScannableDays := context.deadline - innerLibrary.signupTime - tempT
			//			if innerScannableDays <= 0 {
			//				c <- 0
			//				continue
			//			}
			//
			//			innerScannableBooksAmount := innerScannableDays * innerLibrary.scansPerDay
			//			innerTempBookIds := make([]int, 0, innerLibrary.bookAmount)
			//			for _, innerBookId := range innerLibrary.bookIds {
			//				if !isBookIdUsed[innerBookId] {
			//					innerTempBookIds = append(innerTempBookIds, innerBookId)
			//				}
			//			}
			//
			//			//sort.Slice(innerTempBookIds, func(i, j int) bool {
			//			//	return context.bookScores[innerTempBookIds[i]] > context.bookScores[innerTempBookIds[j]]
			//			//})
			//
			//			innerForSum := innerTempBookIds[0:int(math.Min(float64(len(innerTempBookIds)), float64(innerScannableBooksAmount)))]
			//			innerSum := 0
			//			for _, innerBookId := range innerForSum {
			//				innerSum += context.bookScores[innerBookId]
			//			}
			//
			//			c <- innerSum
			//			//if tempMax <= innerSum {
			//			//	tempMax = innerSum
			//			//}
			//		}
			//	}()
			//}
			////

			for _, innerLibrary := range context.libraries {
				if isLibraryIdUsed[innerLibrary.id] {
					continue
				}

				innerScannableDays := context.deadline - innerLibrary.signupTime - tempT
				if innerScannableDays <= 0 {
					continue
				}

				innerScannableBooksAmount := innerScannableDays * innerLibrary.scansPerDay
				innerTempBookIds := make([]int, 0, innerLibrary.bookAmount)
				for _, innerBookId := range innerLibrary.bookIds {
					if !isBookIdUsed[innerBookId] {
						innerTempBookIds = append(innerTempBookIds, innerBookId)
					}
				}

				//sort.Slice(innerTempBookIds, func(i, j int) bool {
				//	return context.bookScores[innerTempBookIds[i]] > context.bookScores[innerTempBookIds[j]]
				//})

				innerForSum := innerTempBookIds[0:int(math.Min(float64(len(innerTempBookIds)), float64(innerScannableBooksAmount)))]
				innerSum := 0
				for _, innerBookId := range innerForSum {
					innerSum += context.bookScores[innerBookId]
				}

				if tempMax <= innerSum {
					tempMax = innerSum
				}
			}

			//for k := 0; k < context.totalLibraries; k++ {
			//	result := <- c
			//	if result > tempMax {
			//		tempMax = result
			//	}
			//} philipp und lukas sind gay

			//fmt.Println("Got after channel")

			for _, bookId := range library.usedBookIds {
				isBookIdUsed[bookId] = false
			}
			isLibraryIdUsed[library.id] = false

			//
			sum := tempMax
			for _, bookId := range library.usedBookIds {
				sum += context.bookScores[bookId]
			}
			if sum >= max {
				max = sum
				maxLibrary = library
				foundMaxLibrary = true
			}
		}

		if !foundMaxLibrary {
			break
		}

		isLibraryIdUsed[maxLibrary.id] = true
		for _, bookId := range maxLibrary.usedBookIds {
			isBookIdUsed[bookId] = true
		}

		T += maxLibrary.signupTime
		usedLibraries = append(usedLibraries, maxLibrary)
		fmt.Println("New T:", T)
	}

	writeOutput(context.outputFilename, usedLibraries)
}

func writeOutput(filename string, libraries []Library) {
	output := strconv.Itoa(len(libraries)) + "\n"

	for _, library := range libraries {
		output += strconv.Itoa(library.id) + " " + strconv.Itoa(len(library.usedBookIds)) + "\n"
		booksOutput := ""
		for j, bookId := range library.usedBookIds {
			if j == len(library.usedBookIds)-1 {
				break
			}
			booksOutput += strconv.Itoa(bookId) + " "
		}
		//fmt.Println(len(library.usedBookIds))
		//fmt.Println(booksOutput)
		booksOutput += strconv.Itoa(library.usedBookIds[len(library.usedBookIds)-1])
		output += booksOutput + "\n"
	}

	ioutil.WriteFile(filename, []byte(output), os.ModeAppend)
}


type Library struct {
	bookIds     []int
	bookAmount  int
	signupTime  int
	scansPerDay int
	usedBookIds []int
	id          int
}

type Context struct {
	libraries []Library
	deadline int
	totalBooks int
	totalLibraries int
	bookScores []int
	outputFilename string
}

func getContextFromFile(filename string) (context Context) {
	context.outputFilename = strings.Split(filename, ".")[0]

	bytes, _ := ioutil.ReadFile(filename)

	input := string(bytes)

	inputLines := strings.Split(input, "\n")

	worldInfo := strings.Split(inputLines[0], " ")
	context.totalBooks, _ = strconv.Atoi(worldInfo[0])
	context.totalLibraries, _ = strconv.Atoi(worldInfo[1])
	context.deadline, _ = strconv.Atoi(worldInfo[2])

	context.bookScores = make([]int, context.totalBooks)
	bookStrings := strings.Split(inputLines[1], " ")
	for i := 0; i < context.totalBooks; i++ {
		context.bookScores[i], _ = strconv.Atoi(bookStrings[i])
	}

	context.libraries = make([]Library, context.totalLibraries)
	for i := 0; i < context.totalLibraries; i++ {
		metadataLineIndex := 2 + 2*i
		booksLineIndex := 2 + 2*i + 1
		metadataStrings := strings.Split(inputLines[metadataLineIndex], " ")
		bookStrings = strings.Split(inputLines[booksLineIndex], " ")
		currLibrary := Library{}
		currLibrary.id = i
		currLibrary.bookAmount, _ = strconv.Atoi(metadataStrings[0])
		currLibrary.signupTime, _ = strconv.Atoi(metadataStrings[1])
		currLibrary.scansPerDay, _ = strconv.Atoi(metadataStrings[2])
		currLibrary.bookIds = make([]int, currLibrary.bookAmount)
		for j := 0; j < currLibrary.bookAmount; j++ {
			currLibrary.bookIds[j], _ = strconv.Atoi(bookStrings[j])
		}
		sort.Slice(currLibrary.bookIds, func(i, j int) bool {
			return context.bookScores[currLibrary.bookIds[i]] > context.bookScores[currLibrary.bookIds[j]]
		})
		context.libraries[i] = currLibrary
	}
	return
}
