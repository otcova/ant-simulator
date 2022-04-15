let triangulateLine;
{
	triangulateLine = getStrokeGeometry;
	/*
	 StrokeGeometryAttributes {
	 width? : number;        // 1 if not defined
	 cap? : string;          // butt, round, square
	 join?: string;          // bevel, round, miter
	 mitterLimit? : number   // for join miter, the maximum angle value to use the miter
	 }
	 */

	var Point = v2;

	Point.Angle = function (p0, p1) {
		return Math.atan2(p1.x - p0.x, p1.y - p0.y);
	};

	Point.Add = function (p0, p1) {
		return new Point(p0.x + p1.x, p0.y + p1.y);
	};

	Point.Sub = function (p1, p0) {
		return new Point(p1.x - p0.x, p1.y - p0.y);
	};

	Point.Middle = function (p0, p1) {
		return Point.Add(p0, p1).scalarMult(.5);
	};

	function getStrokeGeometry(points, attrs) {
		var EPSILON = 0.0001;

		// trivial reject
		if (points.length < 2) {
			return [];
		}

		var cap = attrs.cap || "butt";
		var join = attrs.join || "bevel";
		var lineWidth = (attrs.width || 1) / 2;
		var miterLimit = attrs.miterLimit || 10;
		var vertices = [];
		var middlePoints = [];  // middle points per each line segment.
		var closed = false;

		if (points.length === 2) {
			join = "bevel";
			createTriangles(points[0], Point.Middle(points[0], points[1]), points[1], vertices, lineWidth, join, miterLimit);
		} else {

			// if (points[0] === points[points.length - 1] ||
			// (points[0].x === points[points.length - 1].x && points[0].y === points[points.length - 1].y )) {
			// 
			// var p0 = points.shift();
			// p0 = Point.Middle(p0, points[0]);
			// points.unshift(p0);
			// points.push(p0);
			// closed= true;
			// }

			var i;
			for (i = 0; i < points.length - 1; i++) {
				if (i === 0) {
					middlePoints.push(points[0]);
				} else if (i === points.length - 2) {
					middlePoints.push(points[points.length - 1])
				} else {
					middlePoints.push(Point.Middle(points[i], points[i + 1]));
				}
			}

			for (i = 1; i < middlePoints.length; i++) {
				createTriangles(middlePoints[i - 1], points[i], middlePoints[i], vertices, lineWidth, join, miterLimit);
			}
		}

		if (!closed) {

			if (cap === "round") {

				var p00 = vertices[0];
				var p01 = vertices[1];
				var p02 = points[1];
				var p10 = vertices[vertices.length - 1];
				var p11 = vertices[vertices.length - 3];
				var p12 = points[points.length - 2];

				createRoundCap(points[0], p00, p01, p02, vertices);
				createRoundCap(points[points.length - 1], p10, p11, p12, vertices);

			} else if (cap === "square") {

				var p00 = vertices[vertices.length - 1];
				var p01 = vertices[vertices.length - 3];

				createSquareCap(
					vertices[0],
					vertices[1],
					Point.Sub(points[0], points[1]).normalize().scalarMult(Point.Sub(points[0], vertices[0]).length()),
					vertices);
				createSquareCap(
					p00,
					p01,
					Point.Sub(points[points.length - 1], points[points.length - 2]).normalize().scalarMult(Point.Sub(p01, points[points.length - 1]).length()),
					vertices);
			}
		}

		return vertices;


		function createSquareCap(p0, p1, dir, verts) {

			verts.push(p0);
			verts.push(Point.Add(p0, dir));
			verts.push(Point.Add(p1, dir));

			verts.push(p1);
			verts.push(Point.Add(p1, dir));
			verts.push(p0);
		}

		function createRoundCap(center, _p0, _p1, nextPointInLine, verts) {

			var radius = Point.Sub(center, _p0).length();

			var angle0 = Math.atan2((_p1.y - center.y), (_p1.x - center.x));
			var angle1 = Math.atan2((_p0.y - center.y), (_p0.x - center.x));

			var orgAngle0 = angle0;

			// make the round caps point in the right direction.

			// calculate minimum angle between two given angles.
			// for example: -Math.PI, Math.PI = 0, -Math.PI/2, Math.PI= Math.PI/2, etc.
			if (angle1 > angle0) {
				while (angle1 - angle0 >= Math.PI - EPSILON) {
					angle1 = angle1 - 2 * Math.PI;
				}
			}
			else {
				while (angle0 - angle1 >= Math.PI - EPSILON) {
					angle0 = angle0 - 2 * Math.PI;
				}
			}

			var angleDiff = angle1 - angle0;

			// for angles equal Math.PI, make the round point in the right direction.
			if (Math.abs(angleDiff) >= Math.PI - EPSILON && Math.abs(angleDiff) <= Math.PI + EPSILON) {
				var r1 = Point.Sub(center, nextPointInLine);
				if (r1.x === 0) {
					if (r1.y > 0) {
						angleDiff = -angleDiff;
					}
				} else if (r1.x >= -EPSILON) {
					angleDiff = -angleDiff;
				}
			}


			// calculate points, and make the cap.
			var nsegments = 5;//(Math.abs(angleDiff * radius) / 7) >> 0;
			nsegments++;

			var angleInc = angleDiff / nsegments;

			for (var i = 0; i < nsegments; i++) {
				verts.push(new Point(center.x, center.y));
				verts.push(new Point(
					center.x + radius * Math.cos(orgAngle0 + angleInc * i),
					center.y + radius * Math.sin(orgAngle0 + angleInc * i)
				));
				verts.push(new Point(
					center.x + radius * Math.cos(orgAngle0 + angleInc * (1 + i)),
					center.y + radius * Math.sin(orgAngle0 + angleInc * (1 + i))
				));
			}
		}

		function signedArea(p0, p1, p2) {
			return (p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y);
		}

		function lineIntersection(p0, p1, p2, p3) {

			var a0 = p1.y - p0.y;
			var b0 = p0.x - p1.x;

			var a1 = p3.y - p2.y;
			var b1 = p2.x - p3.x;

			var det = a0 * b1 - a1 * b0;
			if (det > -EPSILON && det < EPSILON) {
				return null;
			} else {
				var c0 = a0 * p0.x + b0 * p0.y;
				var c1 = a1 * p2.x + b1 * p2.y;

				var x = (b1 * c0 - b0 * c1) / det;
				var y = (a0 * c1 - a1 * c0) / det;
				return new Point(x, y);
			}
		}

		function createTriangles(p0, p1, p2, verts, width, join, miterLimit) {

			var t0 = Point.Sub(p1, p0);
			var t2 = Point.Sub(p2, p1);

			t0.perpendicular().normalize().scalarMult(width);
			t2.perpendicular().normalize().scalarMult(width);

			// triangle composed by the 3 points if clockwise or couterclockwise.
			// if counterclockwise, we must invert the line threshold points, otherwise the intersection point
			// could be erroneous and lead to odd results.
			if (signedArea(p0, p1, p2) > 0) {
				t0.invert();
				t2.invert();
			}

			var pintersect = lineIntersection(Point.Add(p0, t0), Point.Add(p1, t0), Point.Add(p2, t2), Point.Add(p1, t2));

			var anchor = null;
			var anchorLength = Number.MAX_VALUE;
			if (pintersect) {
				anchor = Point.Sub(pintersect, p1);
				anchorLength = anchor.length();
			}
			var dd = (anchorLength / width) | 0;
			var p0p1 = Point.Sub(p0, p1);
			var p0p1Length = p0p1.length();
			var p1p2 = Point.Sub(p1, p2);
			var p1p2Length = p1p2.length();

			/**
			 * the cross point exceeds any of the segments dimension.
			 * do not use cross point as reference.
			 * This case deserves more attention to avoid redraw, currently works by overdrawing large parts.
			 */
			if (anchorLength > p0p1Length || anchorLength > p1p2Length) {

				verts.push(Point.Add(p0, t0));
				verts.push(Point.Sub(p0, t0));
				verts.push(Point.Add(p1, t0));

				verts.push(Point.Sub(p0, t0));
				verts.push(Point.Add(p1, t0));
				verts.push(Point.Sub(p1, t0));

				if (join === "round") {
					createRoundCap(p1, Point.Add(p1, t0), Point.Add(p1, t2), p2, verts);
				} else if (join === "bevel" || (join === "miter" && dd >= miterLimit)) {
					verts.push(p1);
					verts.push(Point.Add(p1, t0));
					verts.push(Point.Add(p1, t2));
				} else if (join === 'miter' && dd < miterLimit && pintersect) {

					verts.push(Point.Add(p1, t0));
					verts.push(p1);
					verts.push(pintersect);

					verts.push(Point.Add(p1, t2));
					verts.push(p1);
					verts.push(pintersect);
				}

				verts.push(Point.Add(p2, t2));
				verts.push(Point.Sub(p1, t2));
				verts.push(Point.Add(p1, t2));

				verts.push(Point.Add(p2, t2));
				verts.push(Point.Sub(p1, t2));
				verts.push(Point.Sub(p2, t2));


			} else {

				verts.push(Point.Add(p0, t0));
				verts.push(Point.Sub(p0, t0));
				verts.push(Point.Sub(p1, anchor));

				verts.push(Point.Add(p0, t0));
				verts.push(Point.Sub(p1, anchor));
				verts.push(Point.Add(p1, t0));

				if (join === "round") {

					var _p0 = Point.Add(p1, t0);
					var _p1 = Point.Add(p1, t2);
					var _p2 = Point.Sub(p1, anchor);

					var center = p1;

					verts.push(_p0);
					verts.push(center);
					verts.push(_p2);

					createRoundCap(center, _p0, _p1, _p2, verts);

					verts.push(center);
					verts.push(_p1);
					verts.push(_p2);

				} else {

					if (join === "bevel" || (join === "miter" && dd >= miterLimit)) {
						verts.push(Point.Add(p1, t0));
						verts.push(Point.Add(p1, t2));
						verts.push(Point.Sub(p1, anchor));
					}

					if (join === 'miter' && dd < miterLimit) {
						verts.push(pintersect);
						verts.push(Point.Add(p1, t0));
						verts.push(Point.Add(p1, t2));
					}
				}

				verts.push(Point.Add(p2, t2));
				verts.push(Point.Sub(p1, anchor));
				verts.push(Point.Add(p1, t2));

				verts.push(Point.Add(p2, t2));
				verts.push(Point.Sub(p1, anchor));
				verts.push(Point.Sub(p2, t2));
			}
		}

	}
}