export const languageIcons = [
    {
        name: "Python",
        link: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg"
    },
    {
        name: "Cpp",
        link: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg"
    },
    {
        name: "Java",
        link: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg"
    },
    {
        name: "Javascript",
        link: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"
    },
    {
        name: "Ruby",
        link: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg"
    },
    {
        name: "Php",
        link: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg"
    },
    {
        name: "Go",
        link: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg"
    },
    {
        name: "Typescript",
        link: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg"
    },
    {
        name: "Swift",
        link: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg"
    },
    {
        name: "Kotlin",
        link: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg"
    },
 
    {
        name: "Csharp",
        link: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg"
    },
    {
        name: "Scala",
        link: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scala/scala-original.svg"
    },
    {
        name: "Perl",
        link: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/perl/perl-original.svg"
    },
    {
        name: "Dart",
        link: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg"
    },
    {
        name: "Haskell",
        link: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/haskell/haskell-original.svg"
    }
  
];

export const languageIconsMap = {
    Python: {
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
        install: ["apt-get install python3"],
        run: ["python3"],
        extension: ".py"
    },
    Cpp: {
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
        install: ["apt-get install g++"],
        compile: ["g++ Main.cpp -o"],
        run: ["./"],
        extension: ".cpp"
    },
    Java: {
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
        install: ["apt-get install default-jdk"],
        compile: ["javac"],
        run: ["java"],
        extension: ".java"
    },
    Javascript: {
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
        install: ["apt-get install nodejs"],
        run: ["node"],
        extension: ".js"
    },
    Ruby: {
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg",
        install: ["apt-get install ruby"],
        run: ["ruby"],
        extension: ".rb"
    },
    Php: {
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
        install: ["apt-get install php"],
        run: ["php"],
        extension: ".php"
    },
    Go: {
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg",
        install: ["apt-get install golang"],
        run: ["go run"],
        extension: ".go"
    },
    Csharp: {
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
        install: ["apt-get install dotnet-sdk-6.0"],
        compile: ["dotnet build filename.csproj"],
        run: ["dotnet run --project "],
        extension: ".cs"
    },
    Scala: {
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scala/scala-original.svg",
        install: [
            "curl -s https://get.sdkman.io",
            "bash",
            "sdk install scala"
        ],
        compile: ["scalac"],
        run: ["scala"],
        extension: ".scala"
    },
    Perl: {
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/perl/perl-original.svg",
        install: ["apt-get install perl"],
        run: ["perl"],
        extension:".pl"
    },
    Haskell: {
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/haskell/haskell-original.svg",
        install: ["apt-get install ghc"],
        compile: ["ghc"],
        run: ["./"],  // After compiling
        extension: ".hs"
    }
};

