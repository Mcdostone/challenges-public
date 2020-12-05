package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

type checker func(string, int, int, string) bool

func partOne(password string, min int, max int, char string) bool {
	if count := strings.Count(password, char); count >= min && count <= max {
		return true
	}
	return false
}

func partTwo(password string, min int, max int, char string) bool {
	bytechar := char[0]
	firstPosition := password[min-1] == bytechar
	lastPosition := password[max-1] == bytechar
	return (firstPosition || lastPosition) && !(firstPosition && lastPosition)
}

func verifyLine(line string, fn checker) bool {
	parts := strings.Split(line, ": ")
	policy := parts[0]
	tmp := strings.Split(policy, " ")
	min, _ := strconv.Atoi(strings.Split(tmp[0], "-")[0])
	max, _ := strconv.Atoi(strings.Split(tmp[0], "-")[1])
	s := tmp[1]
	return fn(parts[1], min, max, s)
}

func main() {
	file, err := os.Open(os.Args[1])
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	valid := 0
	for scanner.Scan() {
		if verifyLine(scanner.Text(), partTwo) {
			valid++
		}
	}
	fmt.Println(valid)
}
