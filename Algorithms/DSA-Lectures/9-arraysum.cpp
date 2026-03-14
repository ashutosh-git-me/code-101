#include<iostream>
using namespace std;

int sum(int arr[], int size){
    int sum=0;
    for(int i=0; i<size; i++){
        sum=sum+arr[i];
    }
    return sum;
}

int main()
{
    int array[100];
    int size;

    cout<<"Enter size: ";
    cin>>size;
    cout<<endl<<"Enter Elements: ";
    for(int i=0; i<size; i++){
        cin>>array[i];
    }

    cout<<"The sum of Array is: "<<sum(array, size);
    return 0;
}