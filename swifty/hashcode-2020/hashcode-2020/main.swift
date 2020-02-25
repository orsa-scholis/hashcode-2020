//
//  main.swift
//  hashcode-2020
//
//  Created by Lukas Bischof on 24.02.20.
//  Copyright © 2020 lukas. All rights reserved.
//

import Foundation

while true {
  let basePath = "/Users/lukas/p/hashcode-2020/swifty/hashcode-2020/hashcode-2020"

  let manager = FileManager.default
  let possibleFiles: String = try! manager.contentsOfDirectory(atPath: basePath + "/data")
                                          .map({ "- \($0.split(separator: ".").first!)" })
                                          .joined(separator: "\n")
  print("Available files: ")
  print(possibleFiles)

  print("Which file to parse?")
  guard let name = readLine() else {
    print("Giv a file!")
    continue;
  }

  let path = "\(basePath)/data/\(name).in"
  let outPath = "\(basePath)/out/\(name).out"

  if !manager.fileExists(atPath: path) {
    print("File does not exist")
    continue;
  }

  print("Start parsing \(path)")
  let context = Parser(content: try! String(contentsOfFile: path)).parse()
  print("... Parsed file")

  print("Start processing")
  let processed = Processor(context: context).process()
  print("...Processed file")

  Writer(libs: processed).write(outputPath: outPath)
  print("Wrote file")

  break;
}
