//
//  main.swift
//  hashcode-2020
//
//  Created by Lukas Bischof on 24.02.20.
//  Copyright © 2020 lukas. All rights reserved.
//

import Foundation

let name = "f_libraries_of_the_world"

print("Start parsing")
let path = "/Users/lukas/Desktop/hashcode-2020/hashcode-2020/data/\(name).in"
let context = Parser(content: try! String(contentsOfFile: path)).parse()
print("Parsed file")

let processed = Processor(context: context).process()
print("Processed file")

let outPath = "/Users/lukas/Desktop/hashcode-2020/hashcode-2020/out/\(name).out"
Writer(libs: processed).write(outputPath: outPath)
print("Wrote file")
