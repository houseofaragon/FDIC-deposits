import csv
import json
import random

random.seed()

# open up the csv file
f = open('/path/to/file','rU')
c = csv.DictReader(f)

# lists for keeping track of what subjects and branches I've already iterated over
subject_list = []
branch_list = []
lev1_list = []
lev2_list = []
lev3_list = []
lev4_list = []

# iterate through file
i = 0
for row in c:
    if i == 0:
        subject = row['subject']
        branch = row['branch']
        if len(row['Level 1']) > 0:
            lev1 = row['Level 1']
        else:
            lev2 = None
        if len(row['Level 2']) > 0:
            lev2 = row['Level 2']
        else:
            lev2 = None
        if len(row['Level 3']) > 0:
            lev3 = row['Level 3']
        else:
            lev3 = None

    else:
        if row['subject'] != subject:

            # add all branches to this subject
            subject_list.append({'name':subject,'type':'subject','children':branch_list})


            # set current subject
            subject = row['subject']

        if row['branch'] != branch:
            # add all concepts to this branch
            branch_list.append({'name':branch,'type':'branch','children':lev1_list})

            # empty lev1_list
            lev1_list = []

            # set new branch
            branch = row['branch']

        if len(row['Level 1']) > 0 and row['Level 1'] != lev1:
            # print lev1
            # add all level 2 concepts to this level 1
            lev1_list.append({'name':lev1,'type':'concept','level':1,'children':lev2_list})
            #print lev1
            #empty lev2_list
            lev2_list = []

            #lev1_list.append(row['Level 1'])
            lev1 = row['Level 1']

        if len(row['Level 2']) > 0 and row['Level 2'] != lev3:
            #print lev2
            #print lev3_list
            # add all level 3 concepts to this level 2
            if lev2 is not None:
                lev2_list.append({'name':lev2,'type':'concept','level':2,'children':lev3_list})

            # empty lev3_list
            lev3_list = []

            # lev2_list.append(row['Level 2'])
            lev2 = row['Level 2']

        if len(row['Level 3']) > 0 and row['Level 3'] != lev3:
            # print lev3
            # add all level 4 concepts to this level 4
            # lev3_list.append({'name':lev3,'type':'concept','level':3})

            # empty level 4 concepts
            # lev4_list = []

            # add new level 3
            if lev3 is not None:
                lev3_list.append({'name':lev3,'type':'concept','level':3,'size':random.randint(1,100)})
            lev3 = row['Level 3']


        #if row['Level 4'] is not None and row['Level 4'] is not lev4:
        #   lev4_list.append({'name':lev4,'type':'concept','level':4})
        #   lev4 = row['Level 4']

    i += 1

f.close()


branch_list.append({'name':branch,'type':'branch','children':lev1_list})

#subject_list.append({'name':subject,'type':'subject','children':branch_list})
subject_dict = {'name':subject,'type':'subject','children':branch_list}

#json_list= json.dumps(subject_list)
json_list = json.dumps(subject_dict)

f = open('/Users/thaymore/Sites/d3/data/trig_map.json','wb')
f.write(json_list)
f.close()