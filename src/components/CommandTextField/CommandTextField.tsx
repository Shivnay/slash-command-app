import React, { useState } from 'react';
import Input from '../../elements/Input/Input';
import Stylesheet from './CommandTextField.module.css';

interface Command {
    operator: string,
    valA: string,
    ValB: string,
    evaluation: string,
    chain: boolean,
    chainResult: string
}

const CommandTextField = () => {
    const [commands, setCommands] = useState<Array<Command>>();

    const add = (valA: string, valB: string): string => (parseFloat(valA) + parseFloat(valB)).toString();
    const subtract = (valA: string, valB: string): string => (parseFloat(valA) - parseFloat(valB)).toString();
    const divide = (valA: string, valB: string): string => (parseFloat(valA) / parseFloat(valB)).toString();
    const mod = (valA: string, valB: string): string => (parseFloat(valA) % parseFloat(valB)).toString();
    const upper = (valA: string): string => valA.toLocaleUpperCase();

    const evaluateCommand = (command: string, prevCommand?: Command): Command | null => {
        // evaluate individual paramters of the command
        const parameters = command.split(' ');
        const operator = parameters[0];
        const valA = parameters[1];
        const valB = parameters[2];
        const chain = parameters[3] === "|";

        let meta: Command = { operator: operator, valA: valA, ValB: valB, chain: chain, evaluation: "", chainResult: "" };
        // return command meta along with evaluation
        if (operator === "add" && parameters.length >= 2)
            meta = { ...meta, evaluation: valB ? add(valA, valB) : valA };
        else if (operator === "subtract" && parameters.length >= 2)
            meta = { ...meta, evaluation: valB ? subtract(valA, valB) : valA };
        else if (operator === "divide" && parameters.length >= 2)
            meta = { ...meta, evaluation: valB ? divide(valA, valB) : valA };
        else if (operator === "mod" && parameters.length >= 2)
            meta = { ...meta, evaluation: valB ? mod(valA, valB) : valA };
        else if (operator === "upper" && parameters.length >= 2)
            meta = { ...meta, evaluation: upper(valA) };
        else return null;
        // evaludate chain result
        if (!prevCommand) return { ...meta, chainResult: meta.evaluation };
        else if (operator === "add") meta.chainResult = add(prevCommand.chainResult, meta.evaluation);
        else if (operator === "subtract") meta.chainResult = subtract(prevCommand.chainResult, meta.evaluation);
        else if (operator === "divide") meta.chainResult = divide(prevCommand.chainResult, meta.evaluation);
        else if (operator === "mod") meta.chainResult = mod(prevCommand.chainResult, meta.evaluation);
        else meta.chainResult = `${prevCommand.chainResult} ${meta.chainResult}`;

        return meta;
    }

    const onChange = (value: string) => {
        if (value === "") setCommands([]);
        // identify command chains
        if (value.match('/')) {
            const chain = value.split('/').slice(1, Infinity);
            let collection: Array<Command> = [];
            let chainedCommand: boolean = false;
            // perform dynamic evaluation on the command chain
            // .........
            for (let index = 0; index < chain.length; index++) {
                const command = chain[index];
                let node: Command | null = chainedCommand
                    ? evaluateCommand(command, collection[index - 1])
                    : evaluateCommand(command);
                if (node) chainedCommand = node.chain;
                if (node) collection.push(node)
            }
            // ...........
            console.log(collection);
            setCommands(collection);
        }
    }

    const evaluate = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }



    const popresult = () => {
        return (
            <div className={Stylesheet.Result}>
                {commands?.map((value, index) => (
                    <React.Fragment key={index+Math.random()}>
                        <h4 key={index + Math.random()}>{value.evaluation}</h4>
                        {value.chain ? <h4 key={index + Math.random()}>|</h4> : null}
                        {commands[index - 1]?.chain && !value.chain
                            ? <React.Fragment key={index+Math.random()}>
                                <h4 key={index + Math.random()}>{"->"}</h4> 
                                <h4 key={index + Math.random()}>{value.chainResult}</h4> 
                            </React.Fragment>
                            : null}
                    </React.Fragment>
                ))}
            </div>
        )
    }

    return (
        <form className={Stylesheet.Container} onSubmit={evaluate}>
            <Input onChange={onChange} />
            {popresult()}
        </form>
    )
}

export default CommandTextField;