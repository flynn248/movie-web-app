## Script converts a .dat format file to a .csv file

from io import FileIO, TextIOWrapper
import os
import csv

FILE_PATH = r"C:\Users\Shane\Documents\UW-Whitewater\Fall 2021\Movie Data"
FILE_NAME = "movies.dat"

def datFilePath() -> tuple[str, str]:
    filepath = input("Enter the directory path of the .dat file you'd like to convert: ")
    fileName = input("Enter the .dat file name: ")
    path = os.path.join(filepath, fileName)
    if os.path.exists(path):
        return filepath, fileName
    else:
        print(f"${path} does not exist!!")
        raise FileNotFoundError

def createCSVDir(filePath: str):
    csvDir = "Data CSV"
    path = os.path.join(filePath, csvDir)
    if not os.path.exists(path):
        os.mkdir(path)
    return path

def convertToCsv(datFilePath: str, datFileName: str):
    delimeter = '\n'
    separator = '\t'
    csvFileName = input("Enter csv file name: ") + ".csv"
    datPath = os.path.join(datFilePath, datFileName)
    csvPath = os.path.join(createCSVDir(datFilePath), csvFileName)

    with open(datPath) as f, open(datFilePath + '\\' + "movie_countries.dat") as f2:
        next(f) # Skip header line
        next(f2)
        with open(csvPath, 'w', newline='') as csvFile:
            seen = set() # set for fast O(1) amortized lookup
            dataWriter = csv.writer(csvFile)
            i = [1]

            for line in f:
                line2 = f2.readline()
                # Stip out the unwanted stuff
                line = line.strip(delimeter)
                line = line.replace('\\N', '')
                line = line.split(separator)

                line2 = line2.strip(delimeter)
                line2 = line2.replace('\\N', '')
                line2 = line2.split(separator)

                line = line[:3] + line[5:6] + line2[1:] + line[6:9] + line[12:14] + line[17:19] + line[20:]
                
                # Check for duplicates
                strLine = ''.join(line)
                if strLine in seen: 
                    continue # skip duplicate
                seen.add(strLine)
                
                dataWriter.writerow(line)

                i[0] += 1




def main():
#    try:
#        filePath = datFilePath()
#    except Exception:
#        print(f"Failed to find")
    convertToCsv(FILE_PATH, FILE_NAME)
    
    print("cake")

if __name__ == '__main__':
    main()

'''
## Script converts a .dat format file to a .csv file

import os
import csv

FILE_PATH = "C:\\Users\\sflyn\\Documents\\UW-Whitewater\\Fall 2021\\Database Mgmt Systems\\Movie Database"
FILE_NAME = "movie_genres.dat"

def datFilePath() -> tuple[str, str]:
    filepath = input("Enter the directory path of the .dat file you'd like to convert: ")
    fileName = input("Enter the .dat file name: ")
    if os.path.exists(filepath + "\\" + fileName):
        return filepath, fileName
    else:
        print(f"${filepath}\{fileName} does not exist!!")
        raise FileNotFoundError

def convertToCsv(datFilePath: str, datFileName: str):
    delimeter = '\\n'
    separator = '\\t'
    csvFileName = datFileName[:-3] + "csv"

    with open(datFilePath + '\\' + datFileName) as f:
        next(f) # Skip header line
        for line in f:
            print(repr(line))
        with open(datFilePath + '\\' + csvFileName, 'w') as csvFile:
            dataWriter = csv.writer(csvfile=csvFile, delimeter=delimeter)
            for line in f:
                dataWriter.writerow(line)
                break


def main():
#    try:
#        filePath = datFilePath()
#    except Exception:
#        print(f"Failed to find")
    convertToCsv(FILE_PATH, FILE_NAME)
    print("cake")

if __name__ == '__main__':
    main()
'''