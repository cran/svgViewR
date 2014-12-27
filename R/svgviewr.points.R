svgviewr.points <- function(x, file=NULL, y=NULL, type="p", col=NULL, col.fill="black", col.stroke="black", z.index=0, layer="", label="", cex=2, lwd=2, opacity.stroke=1, opacity.fill=1, animate=TRUE, append=TRUE){

	# IF Y IS NON-NULL, ADD AS SECOND COLUMN TO X
	if(!is.null(y)) x <- cbind(x, y)

	# SUPRESS EXPONENTIAL FORMAT FOR NEARLY ZERO VALUES (CANNOT BE READ BY SVG READER)
	options(scipen=10)
	x <- round(x, 8)

	# IF COL IS SPECIFIED, OVERWRITE FILL AND STROKE
	if(!is.null(col)){col.fill <- col;col.stroke <- col}

	# SET GRAPHICAL PARAMETERS
	svg_gp <- c("col", "col.fill", "col.stroke", "label", "layer", "opacity.fill", "opacity.stroke", "cex", "lwd", "z.index")

	# CONVERT GRAPHICAL PARAMETERS TO VECTORS WITH SAME NUMBER OF ELEMENTS OF FIRST X DIMENSION
	for(gpar in svg_gp) if(length(get(gpar)) == 1) assign(gpar, rep(get(gpar), dim(x)[1]))

	# EMPTY NEW LINES
	new_lines <- rep(NA, dim(x)[1])

	# IF POINTS ARE MATRIX, MAKE INTO AN ARRAY
	if(length(dim(x)) == 2) x <- array(x, dim=c(dim(x), 1))

	# IF SECOND DIMENSION IS OF LENGTH TWO, ADD THIRD DIMENSION OF ZEROS
	if(dim(x)[2] == 2){
		xn <- array(NA, dim=c(dim(x)[1], 3, dim(x)[3]))
		for(i in 1:dim(x)[3]){
			if(is.matrix(x[, , i])){
				xn[, , i] <- cbind(x[, , i], rep(0, nrow(x[, , i])))
			}else{
				xn[, , i] <- c(x[, , i], 0)
			}
		}
		x <- xn
	}

	# CHECK IF EXTRA DIMENSIONS OF POINTS SHOULD BE SUPERIMPOSED
	if(dim(x)[3] > 1 && animate == FALSE) new_lines <- rep(NA, dim(x)[1]*(dim(x)[2]/3))

	# WRITE POINTS TO SVG STRUCTURE
	for(i in 1:dim(x)[1]){

		animate_points_str <- ""
		if(dim(x)[3] > 1 && animate == TRUE){

			# CHECK THAT POINTS CHANGE POSITION BEFORE PRINTING ANIMATION STRING
			sum_sd <- sum(apply(matrix(x[i, , ], ncol=3, byrow=T), 2, sd))

			if(sum_sd > 0 || is.na(sum_sd)){
				animate_points_str <- paste("animate=\"", paste(apply(x[i, , ], 2, 'paste', collapse=" "), collapse=", "), "\"", sep="")
			}
		}

		new_lines[i] <- paste("\t<circle z-index=\"", z.index[i], "\" layer=\"", layer[i], "\" cx=\"", x[i, 1, 1], "\" cy=\"", x[i, 2, 1], "\" cz=\"", x[i, 3, 1], "\" label=\"", label[i], "\" r=\"", cex[i], "\" stroke=\"", col.stroke[i], "\" stroke-width=\"", lwd[i], "\" fill=\"", col.fill[i], "\" fill-opacity=\"", opacity.fill[i], "\" stroke-opacity=\"", opacity.stroke[i], "\" ", animate_points_str," />", sep="")

		if(dim(x)[3] > 1 && animate == FALSE){
		
			for(k in 2:dim(x)[3]){
				new_lines[(i + dim(x)[1]*(k-1))] <- paste("\t<circle z-index=\"", z.index[i], "\" layer=\"", layer[i], "\" cx=\"", x[i, 1, k], "\" cy=\"", x[i, 2, k], "\" cz=\"", x[i, 3, k], "\" label=\"", label[i], "\" r=\"", cex[i], "\" stroke=\"", col.stroke[i], "\" stroke-width=\"", lwd[i], "\" fill=\"", col.fill[i], "\" fill-opacity=\"", opacity.fill[i], "\" stroke-opacity=\"", opacity.stroke[i], "\" ", animate_points_str," />", sep="")
			}
		}
	}

	# REMOVE SCIENTIFIC NOTATION
	options(scipen=0)

	# IF FILE IS NULL, RETURN LINES OF SVG OBJECTS
	if(is.null(file)) return(new_lines)

	# SAVE NEW LINES TO FILE
	svgviewr.write(new_lines, file, append=append)
}