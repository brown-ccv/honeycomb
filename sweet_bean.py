from sweetbean.stimulus import TextStimulus
from sweetbean.sequence import Block, Experiment

text = TextStimulus(duration=2000, text='press a or b or wait', color='blue', choices=['a', 'b'])

block = Block([text])
experiment = Experiment([block])

experiment.to_honeycomb()
