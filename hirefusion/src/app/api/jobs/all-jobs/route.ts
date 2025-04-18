import { JobModel } from '@/models/User'; // Correct path
import dbConnect from '@/lib/dbConnect';

// This is for App Router, NOT Pages Router
export async function GET(request: Request) {
  await dbConnect();

  try {
    const jobs = await JobModel.find({}).sort({ createdAt: -1 });

    return Response.json(jobs, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
