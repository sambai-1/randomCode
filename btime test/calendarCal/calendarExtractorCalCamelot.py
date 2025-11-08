import camelot

lattice = camelot.read_pdf('test.pdf', pages='all', flavor='lattice', suppress_stdout=False)

for table in lattice:
    print(table)