# Pola Evaluator Explained

## **Overview**
The `PolaEvaluator` class is designed to evaluate scenarios based on conditions and expressions defined in Pola policies. It utilizes the Acorn library for parsing JavaScript expressions, Axios for making HTTP requests, and Ajv for JSON schema validation. This class can parse, evaluate, and analyze scenarios, allowing developers to validate the behavior of policies under different conditions.

## **Class: `PolaEvaluator`**
### **Attributes:**
- **`validate`**: A function that validates the structure of conditions using the Ajv schema validator.
- **`analysisEnabled`**: A boolean flag that determines whether scenario analysis should be performed using OpenAI's API. This flag is set based on the configuration (`config.POLA_ANALYSIS`).

### **Constructor:**
The constructor initializes the validation function (`validate`) using a compiled JSON schema and sets the `analysisEnabled` flag based on the configuration.

## **Method: `parseExpression`**
### **Description:**
This method parses a given expression into an Abstract Syntax Tree (AST) using the Acorn library.

### **Parameters:**
- **`expression`** (`string`): The expression to parse.

### **Returns:**
- **`ParsedExpression`**: An object containing the parsed AST and the original expression string.

### **Example Usage:**
```typescript
const parsed = polaEvaluator.parseExpression("P.yearsOfExperience >= 5");
```

## **Method: `evaluate`**
### **Description:**
This method evaluates a parsed AST node within a given context. The context is a key-value store that provides values for identifiers used in the expression.

### **Parameters:**
- **`node`** (`acorn.Node`): The AST node to evaluate.
- **`context`** (`Record<string, any>`): The context in which to evaluate the node.

### **Returns:**
- **`any`**: The result of the evaluation.

### **Logic:**
The method supports various types of nodes, including literals, identifiers, member expressions, binary expressions, logical expressions, unary expressions, conditional expressions, and function calls. The function handles the evaluation based on the type of node and uses recursion to process nested expressions.

### **Exception Handling:**
- The method throws an error if an unsupported node type or operator is encountered.
- It also handles errors during function calls and logs relevant warnings.

### **Example Usage:**
```typescript
const result = polaEvaluator.evaluate(parsed.ast, { yearsOfExperience: 5 });
```

## **Method: `evaluateMatch`**
### **Description:**
This method evaluates a match condition within a given context. The match condition may consist of multiple logical conditions, such as `all`, `any`, or `none`.

### **Parameters:**
- **`match`** (`Match`): The match condition to evaluate.
- **`context`** (`Record<string, any>`): The context in which to evaluate the match condition.
- **`details`** (`EvaluationDetail[]`): An array to store detailed evaluation results for debugging or analysis.

### **Returns:**
- **`boolean`**: A boolean indicating whether the match condition is satisfied.

### **Logic:**
The method recursively evaluates conditions specified in the `all`, `any`, or `none` fields. If an expression is provided (`expr`), it parses and evaluates it within the provided context. The result of the evaluation is stored in the `details` array.

### **Exception Handling:**
- The method throws an error if the match condition is invalid or unsupported.

### **Example Usage:**
```typescript
const matchResult = polaEvaluator.evaluateMatch(match, context, []);
```

## **Method: `evaluateScenario`**
### **Description:**
This method evaluates a single scenario based on its conditions and the provided context.

### **Parameters:**
- **`scenario`** (`Scenario`): The scenario to evaluate.
- **`context`** (`Record<string, any>`): The context in which to evaluate the scenario.

### **Returns:**
- **`Promise<boolean>`**: A boolean indicating whether the scenario passed (matches the expected outcome).

### **Logic:**
The method first validates the scenario's condition using the Ajv validator. It then evaluates the condition using `evaluateMatch` or by evaluating a script directly if provided. If the result matches the expected outcome (`scenario.Expected`), it returns true; otherwise, it returns false.

### **Example Usage:**
```typescript
const scenarioResult = await polaEvaluator.evaluateScenario(scenario, context);
```

## **Method: `analyzeEvaluationResult`**
### **Description:**
This method analyzes the result of a scenario evaluation using OpenAI's API. It generates a narrative that summarizes the scenario and explains the evaluation result.

### **Parameters:**
- **`scenario`** (`Scenario`): The scenario being analyzed.
- **`context`** (`Record<string, any>`): The context in which the scenario was evaluated.
- **`actual`** (`boolean`): The actual result of the scenario evaluation.

### **Returns:**
- **`Promise<string>`**: A string containing the analysis and narrative of the scenario evaluation.

### **Logic:**
The method constructs a detailed prompt for OpenAI's API, including the scenario conditions, evaluation report, and context data. It sends this prompt to the API and returns the generated analysis.

### **Exception Handling:**
- The method catches and logs errors during the API call and rethrows them to halt execution.

### **Example Usage:**
```typescript
const analysis = await polaEvaluator.analyzeEvaluationResult(scenario, context, true);
```

## **Method: `evaluateScenariosFromFile`**
### **Description:**
This method evaluates a set of scenarios loaded from a YAML file using the provided context. It prints a summary report of the evaluation results.

### **Parameters:**
- **`filePath`** (`string`): The path to the YAML file containing the scenarios.
- **`context`** (`Record<string, any>`): The context in which to evaluate the scenarios.

### **Returns:**
- **`Promise<void>`**: No return value, but the method prints a summary report.

### **Logic:**
The method reads the YAML file, parses the scenarios, and evaluates each scenario using `evaluateScenario`. It keeps track of the number of passed and failed scenarios and prints a summary report at the end.

### **Example Usage:**
```typescript
await polaEvaluator.evaluateScenariosFromFile('scenarios.yaml', context);
```

## **Interaction Between Functions:**
- **`evaluateScenario`** interacts with `evaluateMatch` and `evaluate` to evaluate conditions and expressions. 
- **`evaluateScenariosFromFile`** is a higher-level method that utilizes `evaluateScenario` to process multiple scenarios from a file.
- **`analyzeEvaluationResult`** is called by `evaluateScenario` to generate a narrative analysis when the analysis feature is enabled.

## **Sample Data and Expected Outputs:**
- **Input**: Scenario with condition `"P.yearsOfExperience >= 5"`, context `{"yearsOfExperience": 6}`.
- **Expected Output**: Evaluation result `true`, indicating that the scenario passed.

## **Summary**
The `PolaEvaluator` class provides a robust mechanism for evaluating complex policy conditions and scenarios, with built-in support for parsing expressions, evaluating match conditions, and generating detailed reports and analyses. The use of Acorn for parsing and the ability to integrate with external services (e.g., OpenAI) enhances its versatility and effectiveness in policy evaluation scenarios.
