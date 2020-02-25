//
// Created by Lukas Bischof on 24.02.20.
// Copyright (c) 2020 lukas. All rights reserved.
//

import Foundation

class Processor {
  fileprivate let context: Context
  fileprivate var processingLibs: [Library]
  fileprivate var scannedBooks: Set<Int>
  fileprivate var timePointer = 0

  init(context: Context) {
    self.context = context
    self.scannedBooks = Set(minimumCapacity: context.booksCount)
    self.processingLibs = Array(context.libs)
  }

  func process() -> [Library] {
    sort()

    while !processingLibs.isEmpty && timePointer <= context.deadline {
      if /*processingLibs.count % 10 == 0*/ true {
        print("Reordering... scanned books: \(scannedBooks.count), time pointer: \(timePointer), remaining: \(context.deadline - timePointer)")
        removeDuplicates()
        sort()
        print(topTen())
      }

      var winner = processingLibs.first!
      winner.scanBooks(ids: winner.availableBookIds())
      context.signup(winner)
      winner.availableBookIds().forEach({ scannedBooks.insert($0) })

      timePointer += winner.signup

      processingLibs.remove(at: 0)
    }

    printStatistics()

    return context.signedUp
  }

  private func removeDuplicates() {
    processingLibs = processingLibs.compactMap { (library: Library) -> Library? in
      var lib = library
      lib.books = library.books.filter { !scannedBooks.contains($0.id) }

      if (lib.books.isEmpty) {
        return nil
      } else {
        return lib
      }
    }
  }

  private func sort() {
    processingLibs.sort { (left: Library, right: Library) in
//      strategy1(left, right)
//      strategy2(left, right)
      strategy3(left, right)
    }
  }

  private func topTen() -> [[Int]] {
    var range: [Library];
    if processingLibs.count <= 10 {
      range = processingLibs
    } else {
      range = Array(processingLibs[0...10])
    }

    return range.map { library in [library.signup, library.summedScore()] }
  }

  private func strategy3(_ left: Library, _ right: Library) -> Bool {
    let leftScore = Float(left.summedScore()) / Float(left.scanProcessDuration)
    let rightScore = Float(right.summedScore()) / Float(right.scanProcessDuration)

    return leftScore > rightScore
  }

  private func strategy2(_ left: Library, _ right: Library) -> Bool {
    if left.signup == right.signup {
      return left.summedScore() > right.summedScore()
    }

    return left.signup < right.signup
  }

  private func strategy1(_ left: Library, _ right: Library) -> Bool {
    let leftScore = left.summedScore()
    let rightScore = right.summedScore()

    if leftScore == rightScore {
      if left.signup == right.signup {
        return left.shipmentRate > right.shipmentRate
      }

      return left.signup < right.signup
    }

    return leftScore > rightScore
  }

  private func printStatistics() {
    let signupTime = context.signedUp.reduce(into: 0, { $0 += $1.signup })

    let formatter = NumberFormatter()
    formatter.numberStyle = .decimal

    print("...... [STATISTICS] ......")
    print("Signed up: \(context.signedUp.count)")
    print("Unused: \(processingLibs.count)")
    print("Given deadline: \(context.deadline)")
    print("Total signup time: \(signupTime)")
    print("Average signup time: \(signupTime / context.signedUp.count)")
    print("Total book score of signed up books: \(formatter.string(for: context.signedUp.reduce(into: 0, { $0 += $1.summedScore() }))!)")
    print("Most valuable unprocessed library: \(findMostValuableLibrary()?.overviewDescription ?? "n/a")")
  }

  private func findMostValuableLibrary() -> Library? {
    guard var lib = processingLibs.first else { return nil }

    processingLibs.forEach { current in
      if current.summedScore() > lib.summedScore() {
        lib = current
      }
    }

    return lib
  }
}
