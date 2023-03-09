import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response'
import 'jspsych/css/jspsych.css'


const jsPsychOptions = {}

function buildTimeline(jsPsych) {
    console.log(jsPsych.version())
    // create a new WritableStream


    const trials = [
        {
            timeline: [{
                type: jsPsychHtmlKeyboardResponse, trial_duration: () => {
                    let duration = "2000";
                    return duration
                }, stimulus: () => {
                    let text = "press a or b or wait";
                    let color = "blue";
                    return "<div style='color: " + color + "'>" + text + "</div>"
                }, choices: () => {
                    let choices = ['a', 'b'];
                    return choices
                }, on_finish: (data) => {
                    data["bean_type"] = 'jsPsychHtmlKeyboardResponse';
                    let duration = "2000";
                    data["bean_duration"] = duration;
                    let text = "press a or b or wait";
                    data["bean_text"] = text;
                    let color = "blue";
                    data["bean_color"] = color;
                    let choices = ['a', 'b'];
                    data["bean_choices"] = choices;
                    let correct_key = "";
                    data["bean_correct_key"] = correct_key;
                    data["bean_correct"] = correct_key == data["response"]
                }
            }], timeline_variables: []
        }]
    return trials;
}

export {jsPsychOptions, buildTimeline}